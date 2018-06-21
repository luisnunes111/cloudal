const OpenNebula = require("opennebula");
const options = require("./../../configurations.json");

const one = new OpenNebula(
  options.opennebula.credentials,
  options.opennebula.ip
);

function getLoggedUserInfo() {
  return new Promise((resolve, reject) => {
    const user = one.getUser(-1);
    user.info(function(err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  }).catch(err => new Error(err));
}
exports.getLoggedUserInfo = getLoggedUserInfo;

exports.getAllVMs = function getAllVMs() {
  return new Promise((resolve, reject) => {
    one.getVMs(function(err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  }).catch(err => new Error(err));
};

exports.createVM = function createVM(
  name = "default",
  ram,
  vcpu,
  templateId = 0
) {
  return new Promise(async (resolve, reject) => {
    let context = "";

    const template = one.getTemplate(templateId);
    const userData = await getLoggedUserInfo();
    if (userData) {
      const ssh_key = userData.USER.TEMPLATE.SSH_PUBLIC_KEY;
      context =
        'CONTEXT=[NETWORK="YES", SSH_PUBLIC_KEY="' + ssh_key + '"]\n' || "";
    }
    template.instantiate(
      name,
      undefined,
      'MEMORY="' + (ram || 1024) + '"\nVCPU="' + (vcpu || 1) + '"\n ' + context,
      function(err, data) {
        if (err) {
          reject(err);
        } else {
          // vm.deploy(0, -1, true, callback,function(err, data) {
          resolve(data);

          // })
        }
      }
    );
  }).catch(err => new Error(err));
};

exports.getInfoVM = function getInfoVM(id) {
  return new Promise((resolve, reject) => {
    const vm = one.getVM(id);
    vm.info(function(err, data) {
      if (err) {
        reject(err);
      } else {
        let status = "pending";
        if (parseInt(data.VM.STATE) >= 3 && parseInt(data.VM.LCM_STATE) === 3) {
          status = "running";
        } else if (
          parseInt(data.VM.STATE) === 8 &&
          parseInt(data.VM.LCM_STATE) === 0
        ) {
          status = "stopped";
        } else if (
          parseInt(data.VM.STATE) === 5 &&
          parseInt(data.VM.LCM_STATE) === 0
        ) {
          status = "paused";
        }

        let res = {
          id: data.VM.ID,
          name: data.VM.NAME,
          status: status,
          template: {
            id: data.VM.TEMPLATE.TEMPLATE_ID,
            cpu: data.VM.TEMPLATE.CPU,
            memory: data.VM.TEMPLATE.MEMORY
          }
        };
        return resolve(res);
      }
    });
  }).catch(err => new Error(err));
};

exports.startVM = function startVM(id) {
  return new Promise((resolve, reject) => {
    const vm = one.getVM(id);
    vm.action("resume", function(err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  }).catch(err => new Error(err));
};

exports.migrateVM = function migrateVM(id, hostID, live) {
  return new Promise((resolve, reject) => {
    const vm = one.getVM(id);
    vm.migrate(hostID, live, false, 0, function(err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  }).catch(err => new Error(err));
};

exports.shutdownVM = function shutdownVM(id, force = false) {
  return new Promise((resolve, reject) => {
    const vm = one.getVM(id);
    vm.action(force ? "poweroff-hard" : "poweroff", function(err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  }).catch(err => new Error(err));
};

exports.rebootVM = function rebootVM(id, force = false) {
  return new Promise((resolve, reject) => {
    const vm = one.getVM(id);
    vm.action(force ? "reboot-hard" : "reboot", function(err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  }).catch(err => new Error(err));
};

exports.deleteVM = function deleteVM(id) {
  return new Promise((resolve, reject) => {
    const vm = one.getVM(parseInt(id));
    vm.action("delete", function(err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  }).catch(err => new Error(err));
};

exports.monitoringVM = function monitoringVM(id) {
  return new Promise((resolve, reject) => {
    const vm = one.getVM(parseInt(id));

    vm.monitoring(function(err, data) {
      if (err) {
        //'Error fetching VM statistics'
        reject(err);
      } else {
        let stats = [];

        if (data.MONITORING_DATA && data.MONITORING_DATA.VM) {
          const totalStats = data.MONITORING_DATA.VM.length;
          for (var i = 0; i < totalStats; i++) {
            stats.push({
              time: data.MONITORING_DATA.VM[i].LAST_POLL,
              cpu: data.MONITORING_DATA.VM[i].MONITORING.CPU,
              memory: data.MONITORING_DATA.VM[i].MONITORING.MEMORY,
              nettx: data.MONITORING_DATA.VM[i].MONITORING.NETTX,
              netrx: data.MONITORING_DATA.VM[i].MONITORING.NETRX
            });
          }
        }
        stats = stats.slice(Math.max(stats.length - 40, 0)); //last 40
        return resolve(stats);
      }
    });
  }).catch(err => new Error(err));
};

// -----------------HOSTS------------------

exports.createHost = function createHost(name) {
  return new Promise((resolve, reject) => {
    const vm = one.createHost(name, "kvm", "qemu", -1, -1, function(err, data) {
      if (err) {
        return reject(err);
      } else {
        return resolve(data);
      }
    });
  }).catch(err => new Error(err));
};

exports.getAllHosts = function getAllHosts() {
  return new Promise((resolve, reject) => {
    const vm = one.getHosts(function(err, data) {
      if (err) {
        return reject(err);
      } else {
        return resolve(data);
      }
    });
  }).catch(err => new Error(err));
};

exports.monitoringHost = function monitoringHost(id) {
  return new Promise((resolve, reject) => {
    const host = one.getHost(id);

    host.monitoring(function(err, data) {
      if (err) {
        return reject(err);
      } else {
        if (data.MONITORING_DATA.HOST) {
          const last =
            data.MONITORING_DATA.HOST[data.MONITORING_DATA.HOST.length - 1];
          const response = {
            clusterName: last.CLUSTER,
            clusterId: last.CLUSTER_ID,
            id: last.ID,
            im_mad: last.IM_MAD,
            vm_mad: last.VM_MAD,
            time: last.LAST_MON_TIME,
            name: last.NAME,
            status: last.STATE,
            vms: last.VMS && last.VMS.ID.join(", "),
            runningVms: last.HOST_SHARE.RUNNING_VMS,
            stats: {
              cpu_usage: last.HOST_SHARE.CPU_USAGE,
              disk_usage: last.HOST_SHARE.DISK_USAGE,
              mem_usage: last.HOST_SHARE.MEM_USAGE,
              free_cpu: last.HOST_SHARE.FREE_CPU,
              free_disk: last.HOST_SHARE.FREE_DISK,
              free_mem: last.HOST_SHARE.FREE_MEM,
              max_cpu: last.HOST_SHARE.MAX_CPU,
              max_disk: last.HOST_SHARE.MAX_DISK,
              max_mem: last.HOST_SHARE.MAX_MEM,
              total_cpu: last.HOST_SHARE.TOTAL_CPU,
              total_mem: last.HOST_SHARE.TOTAL_MEM,
              used_cpu: last.HOST_SHARE.USED_CPU,
              used_disk: last.HOST_SHARE.USED_DISK,
              used_mem: last.HOST_SHARE.USED_MEM
            }
          };

          return resolve(response);
        } else {
          resolve();
        }
      }
    });
  }).catch(err => new Error(err));
};
