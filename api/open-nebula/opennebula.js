const OpenNebula = require("opennebula");
const options = require("./../../configurations.json");

const one = new OpenNebula(
  options.opennebula.credentials,
  options.opennebula.ip
);

exports.getAllVMs = function getAllVMs() {
  return new Promise((resolve, reject) => {
    one.getVMs(function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  }).catch(err => new Error(err));
};

exports.createVM = function createVM(name = "default", ram, vcpu, templateId = 0) {
  return new Promise((resolve, reject) => {
    const template = one.getTemplate(templateId);
    const context = 'CONTEXT=[NETWORK="YES", SSH_PUBLIC_KEY="root[SSH_PUBLIC_KEY]"]\n';
    template.instantiate(name, undefined, 'MEMORY="' + (ram || 1024) + '"\nVCPU="' + (vcpu || 1) + '"\n ' + context, function (err, data) {
      if (err) {
        reject(err);
      } else {
        // vm.deploy(0, -1, true, callback,function(err, data) {
        resolve(data);

        // })
      }
    });
  }).catch(err => new Error(err));
};

exports.getInfoVM = function getInfoVM(id) {
  return new Promise((resolve, reject) => {
    const vm = one.getVM(id);
    vm.info(function (err, data) {
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
    vm.action("resume", function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  }).catch(err => new Error(err));
};

exports.migrateVM = function migrateVM(id, hostID, live, enforce, datastore) {
  return new Promise((resolve, reject) => {
    const vm = one.getVM(id);

    vm.migrate(undefined, id, hostID, live, enforce, datastore, function (err, data) {
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
    vm.action(force ? "poweroff-hard" : "poweroff", function (err, data) {
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
    vm.action(force ? "reboot-hard" : "reboot", function (err, data) {
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
    vm.action("delete", function (err, data) {
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

    vm.monitoring(function (err, data) {
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