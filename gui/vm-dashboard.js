const blessed = require("blessed");
const contrib = require("blessed-contrib");
const client = require("../api/open-nebula/opennebula");
const history = require("../lib/configs/history.js");

module.exports = class VmDashboardPage {
  constructor(state) {
    this.vmID = state.id;
    this.screen = state.screen;

    this.box = undefined;
    this.infoBox = undefined;
    this.networkGraph = undefined;
    this.cpuDonut = undefined;
    this.memoryDonut = undefined;
    this.info = {}; //keeps all text components of infoBox

    this.stats = [];
    this.vmInfo = {};
    this.updateInterval = undefined;

    this.init();

    this.done = this.done.bind(this);
  }

  init() {
    this.createBox();
    this.createVmInfo();
    this.createNetworkGraph();
    this.createBoxVmStats();

    this.loadVmData();
    this.updateInterval = setInterval(this.loadVmData.bind(this), 3000); //de 3 em 3 segundo faz update aos dados
  }

  async loadVmData() {
    const data = await Promise.all([
      client.monitoringVM(this.vmID),
      client.getInfoVM(this.vmID)
    ]);

    this.stats = data[0];
    this.vmInfo = data[1];
    this.updateInterface();

    return data;
  }

  updateInterface() {
    this.updateVmInfo();
    this.updateVmStats();
    this.updateNetworkGraph();
  }

  updateVmStats() {
    const templateMemory = parseInt(this.vmInfo.template.memory);

    const lastStat = this.stats[this.stats.length - 1];
    const cpu = parseFloat(lastStat.cpu);
    const memory = ((parseInt(lastStat.memory) / 1024) * 100) / templateMemory;

    this.cpuDonut.setData([{ percent: cpu, label: "CPU", color: "cyan" }]);
    this.memoryDonut.setData([
      { percent: memory, label: "Memory", color: "cyan" }
    ]);

    // this.networkGraph.setData([net_tx, net_rx]);
    this.screen.render();
  }

  updateVmInfo() {
    const lastStat = this.stats[this.stats.length - 1];
    this.info.cpuInfo.content = lastStat.cpu;
    this.info.memoryInfo.content = this.memoryFormat(parseInt(lastStat.memory));
    this.info.diskInfo.content = "0";
    this.info.nameInfo.content = this.vmInfo.name;
    this.info.templateIdInfo.content = this.vmInfo.template.id;
    this.info.vmIdInfo.content = this.vmInfo.id;
    this.info.lastUpdateInfo.content = new Date(
      parseInt(lastStat.time) * 1000
    ).toLocaleString();
    this.info.statusInfo.content = this.vmInfo.status;
    this.info.statusInfo.style = {
      ...this.info.statusInfo.style,
      bg: this.vmStatusToColor(this.vmInfo.status)
    };

    this.screen.render();
  }

  updateNetworkGraph() {
    const net_tx = {
      title: "Net TX",
      x: this.stats.map(x =>
        new Date(parseInt(x.time) * 1000).toLocaleTimeString()
      ),
      y: this.stats.map(x => parseInt(x.nettx)),
      style: {
        line: "red"
      }
    };
    const net_rx = {
      title: "Net RX",
      x: this.stats.map(x =>
        new Date(parseInt(x.time) * 1000).toLocaleTimeString()
      ),
      y: this.stats.map(x => parseInt(x.netrx)),
      style: {
        line: "blue"
      }
    };
    this.networkGraph.setData([net_tx, net_rx]);
    this.screen.render();
  }

  createVmInfo() {
    this.infoBox = blessed.box({
      parent: this.box,
      top: 20,
      left: 0,
      width: "98%",
      height: 10,
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

    // state, memory, cpu, disk?
    this.label(1, 6, "CPU");
    this.info.cpuInfo = this.label(2, 6, "");
    this.label(1, 18, "MEMORY");
    this.info.memoryInfo = this.label(2, 18, "");
    this.label(1, 35, "DISK SPACE");
    this.info.diskInfo = this.label(2, 37, "");
    this.info.statusInfo = this.vmStatusBox(1, 55, "runnin");

    this.label(5, 6, "Name");
    this.info.nameInfo = this.label(6, 6, "");
    this.label(5, 18, "Template ID");
    this.info.templateIdInfo = this.label(6, 18, "");
    this.label(5, 40, "VM ID");
    this.info.vmIdInfo = this.label(6, 40, "");
    this.label(5, 55, "Last update");
    this.info.lastUpdateInfo = this.label(6, 55, "");

    this.screen.render();
  }

  vmStatusBox(top, left, content, color = "black") {
    return blessed.text({
      parent: this.infoBox,
      top: top,
      left: left,
      style: {
        fg: "white",
        bg: color
      },
      padding: {
        left: 3,
        right: 3,
        top: 1,
        bottom: 1
      },
      content: content,
      bold: true
    });
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

  vmStatusToColor(status) {
    // pending (blue), running(green), stopped(red), paused(yellow)
    switch (status) {
      case "pending":
        return "blue";
      case "running":
        return "green";
      case "stopped":
        return "red";
      case "paused":
        return "yellow";
    }
  }

  memoryFormat(y) {
    var abs_y = Math.abs(y);
    if (abs_y >= 1048576) {
      return parseInt(y / 1048576) + "GB";
    } else if (abs_y >= 1024) {
      return parseInt(y / 1024) + "MB";
    } else if (abs_y < 1 && y > 0) {
      return parseInt(y);
    } else if (abs_y === 0) {
      return "";
    } else {
      return parseInt(y);
    }
  }
  createBoxVmStats() {
    this.cpuDonut = contrib.donut({
      top: 0,
      right: 0,
      height: 10,
      width: "20%",
      radius: 8,
      arcWidth: 3,
      remainColor: "black",
      yPadding: 2,
      data: [{ percent: 77, label: "CPU", color: "green" }]
    });

    this.memoryDonut = contrib.donut({
      top: 10,
      right: 0,
      height: 10,
      width: "20%",
      radius: 8,
      arcWidth: 3,
      remainColor: "black",
      yPadding: 2,
      data: [{ percent: 45, label: "Memory", color: "cyan" }]
    });

    this.box.append(this.cpuDonut);
    this.box.append(this.memoryDonut);
    this.screen.render();
  }

  createNetworkGraph() {
    this.networkGraph = contrib.line({
      width: "79%",
      height: 20,
      top: 0,
      left: 0,
      style: {
        line: "yellow",
        text: "white",
        baseline: "white",
        border: {
          fg: "white"
        }
      },
      border: {
        type: "line"
      },
      xLabelPadding: 3,
      xPadding: 5,
      showLegend: true,
      legend: {
        width: 12
      },
      wholeNumbersOnly: false, //true=do not show fraction in y axis
      label: "Network stats",
      numYLabels: 7
    });
    this.box.append(this.networkGraph); //must append before setting data
    this.screen.render();
  }

  createBox() {
    const self = this;

    this.box = blessed.box({
      parent: this.screen,
      top: "center",
      left: "center",
      width: "100%",
      height: "100%",
      content: "Dashboard",
      tags: true,
      border: {
        type: "line"
      },
      padding: 0,
      style: {
        fg: "white",
        bg: "black",
        border: {
          fg: "#ff0000"
        }
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
    this.networkGraph.destroy();
    this.screen.render();
  }
};
