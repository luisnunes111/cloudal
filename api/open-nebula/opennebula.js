const OpenNebula = require("opennebula");

const one = new OpenNebula("oneadmin:opennebula", "http://localhost:2633/RPC2");

exports.getAllVMs = function getAllVMs() {
  return new Promise((resolve, reject) => {
    one.getVMs(function(err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

exports.createVM = function createVM(name, templateId) {
  templateId = templateId || 0;
  name = name || "default";

  return new Promise((resolve, reject) => {
    const template = one.getTemplate(templateId);
    template.instantiate(name, undefined, undefined, function(err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

exports.getInfoVM = function getInfoVM(id) {
  return new Promise((resolve, reject) => {
    const vm = one.getVM(id);
    vm.info(function(err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

exports.shutdownVM = function shutdownVM(id) {
  return new Promise((resolve, reject) => {
    const vm = one.getVM(id);
    vm.action("poweroff", function(err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

exports.rebootVM = function rebootVM(id) {
  return new Promise((resolve, reject) => {
    const vm = one.getVM(id);
    vm.action("reboot", function(err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
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
  });
};
