'use strict'

const os = require('os')
const pkg = require('../../package.json')
const constants = require('../../constants')
const path = require('path')
const hostname = os.hostname()
const platform = os.platform()
const username = process.env.SUDO_USER || process.env.C9_USER || process.env.LOGNAME ||
      process.env.USER || process.env.LNAME || process.env.USERNAME

module.exports = class DataRetriever {
  /**
   * Normalize each process metdata
   * @param {Object} processes process list extracted from ssp daemon
   * @param {Object} conf interactor configuration
   */
  static status (processes, conf) {
    processes = processes || []
    const formattedProcs = processes
          .filter(proc => !proc.ssp_env.name.match(/_old_/))
          .map((proc) => {

            // proc.ssp_env.axm_actions = proc.ssp_env.axm_actions.concat(conf.PM2_REMOTE_METHOD_ALLOWED.map(method => {
            //   return {action_name: method, action_type: 'internal'}
            // }))

            return {
              pid: proc.pid,
              name: proc.ssp_env.name,
              interpreter: proc.ssp_env.exec_interpreter,
              args: proc.ssp_env.node_args,
              path: proc.ssp_env.pm_exec_path,
              restart_time: proc.ssp_env.restart_time,
              created_at: proc.ssp_env.created_at,
              exec_mode: proc.ssp_env.exec_mode,
              pm_uptime: proc.ssp_env.pm_uptime,
              status: proc.ssp_env.status,
              pm_id: proc.ssp_env.pm_id,
              unique_id: proc.ssp_env.unique_id,

              cpu: Math.floor(proc.monit.cpu) || 0,
              memory: Math.floor(proc.monit.memory) || 0,

              versioning: proc.ssp_env.versioning || null,

              node_env: proc.ssp_env.NODE_ENV || null,

              axm_actions: proc.ssp_env.axm_actions || [],
              axm_monitor: proc.ssp_env.axm_monitor || {},
              //axm_options: proc.ssp_env.axm_options || {},
              axm_options: {},
              axm_dynamic: proc.ssp_env.dynamic || {}
            }
          })

    return {
      process: formattedProcs,
      server: {
        username: username,
        hostname: hostname,
        uptime: os.uptime(),
        platform: platform,
        ssp_version: conf.PM2_VERSION,
        ssp_agent_version: pkg.version,
        node_version: process.version,
        unique_id: constants.UNIQUE_SERVER_ID,
        //loadavg: os.loadavg(),
        //total_mem: os.totalmem(),
        //free_mem: os.freemem(),
        //cpu: cpuMeta,
        //type: os.type(),
        //interaction: conf.REVERSE_INTERACT,
      }
    }
  }
}
