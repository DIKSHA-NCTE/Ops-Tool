let CONSTANTS = {
  USER_BULK_UPLOAD_REQUEST: `INSERT INTO USER_BULK_UPLOAD SET ?`,
  GET_BULK_REQUEST_ENTRY: `SELECT * FROM USER_BULK_UPLOAD WHERE id = ?`,
  UPDATE_BULK_FAIL_REQUEST: `UPDATE USER_BULK_UPLOAD 
                                SET existingUsersCsv = ?,
                                invalidNewUsersCsv = ?,
                                newUsersCSV = ?,
                                failureReason= ?,
                                status='fail'
                                WHERE batchId = ? AND
                                id = ?`,
  UPDATE_BULK_PASS_REQUEST: `UPDATE USER_BULK_UPLOAD 
                                SET existingUsersCsv = ?,
                                invalidNewUsersCsv = ?,
                                newUsersCSV = ?,
                                comments= ?,
                                processId = ?,
                                status='success'
                                WHERE batchId = ? AND
                                id = ?`,
  FETCH_DB_ROW: `SELECT * FROM USER_BULK_UPLOAD WHERE batchId = ?`,
  INSERT_TO_CONTENT_INFO: `INSERT INTO CONTENT_INFO SET ?`,
  INSERT_TO_BROADCAST_CONTENT_INFO: `INSERT INTO BROADCAST_CONTENT_INFO SET ?`,
  GET_CONTENT_INFO_DATA: `SELECT COUNT(*) AS COUNT FROM CONTENT_INFO WHERE status = ?`,
  GET_CONTENT_BULK_UPLOAD_DATA: `SELECT COUNT(*) AS COUNT FROM CONTENT_BULK_UPLOAD WHERE status = ?`,
  GET_BROADCAST_CONTENTS_INFO_DATA: `SELECT COUNT(*) AS COUNT FROM BROADCAST_CONTENT_INFO WHERE status = ?`,
  GET_USER_BULK_UPLOAD_DATA: `SELECT COUNT(*) AS COUNT FROM USER_BULK_UPLOAD WHERE status = ?`,

  GET_MODULES_BY_ROLES: `SELECT * FROM MODULES WHERE isVisible = true AND roles RLIKE `,
  GET_MODULES_LIST: `SELECT * FROM MODULES WHERE is_deleted=false ORDER BY name ASC`,
  INSERT_TO_MODULES: `INSERT INTO MODULES (name, description, url, roles, isAdminModule, isVisible, isRootModule, rootModuleId, icon) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  // UPDATE_MODULE: `UPDATE MODULES SET ? where id = ?`,
  DELETE_MODULE: `UPDATE MODULES SET is_deleted=true WHERE id = ?`,
  GET_MODULE: `SELECT * FROM MODULES WHERE id = ?`,
  GET_SUB_MODULES: `SELECT * FROM MODULES WHERE rootModuleId = ? AND roles RLIKE `,

  // GET_CONFIGURATION_MODULES_LIST: `SELECT module FROM CONFIGURATIONS ORDER BY module ASC`,
  // GET_FIELDS_BY_MODULE: `SELECT field FROM CONFIGURATIONS WHERE module = ? ORDER BY field ASC`,
  GET_CONSTANTS_LIST: `SELECT field_name as field, GROUP_CONCAT(CONCAT_WS('||', id, field_value)) as fvalues from CONSTANTS where is_deleted=false GROUP BY field_name`,
  ADD_CONSTANT: `INSERT INTO CONSTANTS (field_name, field_value) VALUES(?, ?)`,
  DELETE_CONSTANT: `UPDATE CONSTANTS SET is_deleted=true where id = ?`,
  INSERT_TO_SHALLOW_CONTENT_INFO: `INSERT INTO SHALLOW_CONTENT_INFO SET ?`
};

module.exports = CONSTANTS;
