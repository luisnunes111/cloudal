const blessed = require("blessed");
const contrib = require("blessed-contrib");
const client = require("../../../api/open-nebula/opennebula");
const history = require("../../../lib/configs/history.js");

module.exports = class HostDashboardPage {
  constructor(state) {
    this.hostID = parseInt(state.id);
    this.screen = state.screen;
    this.layout = state.layout;

    this.box = undefined;

    this.info = {}; //keeps all text components of infoBox

    this.stats = {};
    this.updateInterval = undefined;

    this.init();

    this.done = this.done.bind(this);
  }

  init() {
    this.createBox();
    this.createHostGauges();
    this.createHostInfo();

    this.loadVmData();
    this.updateInterval = setInterval(this.loadVmData.bind(this), 3000); //de 3 em 3 segundo faz update aos dados
  }

  async loadVmData() {
    const data = await Promise.all([client.monitoringHost(this.hostID)]);

    this.stats = data[0];
    this.updateInterface();
  }

  updateInterface() {
    if (this.stats) {
      this.updateHostInfo();
      this.updateHostGauges();
    }
  }

  updateHostInfo() {
    this.info.name.content = this.stats.name;
    this.info.status.content = this.stats.status;
    this.info.vms.content = this.stats.vms;
    this.info.runningVms.content = this.stats.runningVms;

    this.info.cluster.content = this.stats.clusterName;
    this.info.clusterId.content = this.stats.clusterId;
    this.info.imMad.content = this.stats.im_mad;
    this.info.vmMad.content = this.stats.vm_mad;

    this.screen.render();
  }

  updateHostGauges() {
    const diskTotal =
        parseInt(this.stats.stats.free_disk) +
        parseInt(this.stats.stats.used_disk),
      freeDisk = (parseInt(this.stats.stats.free_disk) * 100) / diskTotal,
      usedDisk = (parseInt(this.stats.stats.used_disk) * 100) / diskTotal,
      freeCPU =
        (parseInt(this.stats.stats.free_cpu) * 100) /
        parseInt(this.stats.stats.total_cpu),
      usedCPU =
        (parseInt(this.stats.stats.used_cpu) * 100) /
        parseInt(this.stats.stats.total_cpu),
      freeMem =
        (parseInt(this.stats.stats.free_mem) * 100) /
        parseInt(this.stats.stats.total_mem),
      usedMem =
        (parseInt(this.stats.stats.used_mem) * 100) /
        parseInt(this.stats.stats.total_mem);

    this.cpuGauge.setStack([
      { percent: freeCPU.toFixed(1), stroke: "green" },
      { percent: usedCPU.toFixed(1), stroke: "red" }
    ]);
    this.memGauge.setStack([
      { percent: freeMem.toFixed(1), stroke: "green" },
      { percent: usedMem.toFixed(1), stroke: "red" }
    ]);
    this.diskGauge.setStack([
      { percent: freeDisk.toFixed(1), stroke: "green" },
      { percent: usedDisk.toFixed(1), stroke: "red" }
    ]);

    this.screen.render();
  }

  createHostInfo() {
    this.infoBox = blessed.box({
      parent: this.box,
      top: "70%",
      left: 0,
      width: "99%",
      height: "30%",
      border: {
        type: "line"
      },
      style: {
        fg: "black",
        bg: "white",
        border: {
          fg: "white"
        }
      }
    });

    this.label(0, "10%", "NAME");
    this.info.name = this.label(1, "10%", "");
    this.label(0, "30%", "STATUS");
    this.info.status = this.label(1, "30%", "");
    this.label(0, "55%", "VMS");
    this.info.vms = this.label(1, "55%", "");
    this.label(0, "80%", "RUNNING VMS");
    this.info.runningVms = this.label(1, "80%", "");

    this.label(3, "10%", "CLUSTER");
    this.info.cluster = this.label(4, "10%", "");
    this.label(3, "30%", "CLUSTER ID");
    this.info.clusterId = this.label(4, "30%", "");
    this.label(3, "55%", "IM_MAD");
    this.info.imMad = this.label(4, "55%", "");
    this.label(3, "80%", "VM_MAD");
    this.info.vmMad = this.label(4, "80%", "");

    this.screen.render();
  }

  label(top, left, content) {
    return blessed.text({
      parent: this.infoBox,
      top: top,
      left: left,
      style: {
        fg: "black",
        bg: "white"
      },
      content: content,
      underline: true,
      bold: true
    });
  }

  createHostGauges() {
    this.cpuGauge = contrib.gauge({
      label: "CPU ",
      top: "10%",
      height: 10
    });
    this.memGauge = contrib.gauge({
      label: "MEMORY ",
      top: "25%",
      height: 10
    });
    this.diskGauge = contrib.gauge({
      label: "DISK ",
      top: "40%",
      height: 10
    });

    this.box.append(this.cpuGauge);
    this.box.append(this.memGauge);
    this.box.append(this.diskGauge);

    this.cpuGauge.setStack([
      { percent: 100, stroke: "green" },
      { percent: 0, stroke: "red" }
    ]);
    this.memGauge.setStack([
      { percent: 100, stroke: "green" },
      { percent: 0, stroke: "red" }
    ]);
    this.diskGauge.setStack([
      { percent: 100, stroke: "green" },
      { percent: 0, stroke: "red" }
    ]);

    this.screen.render();
  }

  createBox() {
    const self = this;

    this.box = blessed.box({
      parent: this.layout,
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      tags: true,
      style: {
        fg: "white",
        bg: "black"
      }
    });

    this.box.key("z", (ch, key) => {
      history.back(self.done);
    });

    this.box.key("x", (ch, key) => {
      history.foward(self.done);
    });

    this.box.focus();
    this.screen.render();
  }

  done() {
    clearInterval(this.updateInterval);
    this.box.destroy();
    this.screen.render();
  }
};
