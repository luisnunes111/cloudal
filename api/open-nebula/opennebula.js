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
  }).catch(err => new Error(err));
};

exports.createVM = function createVM(name = "default", templateId = 0) {
  return new Promise((resolve, reject) => {
    const template = one.getTemplate(templateId);
    template.instantiate(name, undefined, undefined, function(err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  }).catch(err => new Error(err));
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
