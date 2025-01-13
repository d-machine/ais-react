// userConfig.ts

const userConfig = {
  applyAccessLevelRestrictions: false,
  onLoad: "executeQuery",
  onLoadParams: ["resource_id", "list"],
  "query-file": "list-query",
  pagenation: true,
  filterable: true,
  sortable: true,
  applicableActions: ["add", "edit", "changePassword", "delete"],
  actionConfig: {
    add: {
      label: "Add New User",
      onPress: "displayForm",
      "form-config": "add",
      onComplete: "refresh",
    },
    edit: {
      label: "Edit User",
      onPress: "dispayForm",
      onPressParams: ["user_id"],
      "form-config": "edit",
      onComplete: "refresh",
    },
    changePassword: {
      label: "Change Password",
      onPress: "displayForm",
      onPressParams: ["user_id"],
      "form-config": "change-password",
      onComplete: "refresh",
    },
    delete: {
      label: "Delete User",
      onPress: "executeQuery",
      query: "CALL delete_user($1, $2)",
      onPressParams: ["user_id"],
      "context-params": ["current_user_id"],
      onComplete: "refresh",
    },
  },
  columns: [
    {
      name: "username",
      label: "Username",
      width: 200,
      sortable: true,
      filterType: "string",
    },
    {
      name: "email",
      label: "Email",
      width: 200,
      sortable: true,
      filterType: "string",
    },
    {
      name: "full_name",
      label: "Full Name",
      width: 200,
      sortable: true,
      filterType: "string",
    },
    {
      name: "reports_to",
      label: "Reports To",
      width: 200,
      sortable: true,
      filterType: "string",
    },
    {
      name: "roles",
      label: "Roles",
      width: 200,
      sortable: true,
      filterType: "string",
    },
    {
      name: "last_updated_by",
      label: "Last Updated By",
      width: 200,
      sortable: true,
      filterType: "string",
    },
    {
      name: "last_updated_at",
      label: "Last Updated At",
      width: 200,
      sortable: true,
      filterType: "string",
    },
  ],
};

export default userConfig;
