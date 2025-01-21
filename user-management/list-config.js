{
  "sections": [
    {
      "sectionType": "FIELDS",
      "sectionName": "Role Details",
      "queryReturnType": "SINGLE_ROW",
      "query": "SELECT  id as role_id, name as role_name, description FROM  administration.role WHERE  id = $1",
      "payload": ["role_id"],
      "applicableActions": ["SAVE", "CANCEL"],
      "actionConfig": {
        "SAVE": {
          "label": "Create Role",
          "actionType": "EXECUTE_QUERY",
          "query": "SELECT administration.insert_role($1, $2, $3) as id;",
          "queryReturnType": "SCALAR",
          "payload": ["role_name", "description"],
          "contextParams": ["current_user_id"],
          "onSuccess": "saveResponseAndGoToNextSection",
          "onFailure": "showErrorSnackbar"
        },
        "CANCEL": {
          "label": "Discard Changes"
        }
      },
      "fields": [
        {
          "name": "role_name",
          "label": "Role Name",
          "type": "TEXT",
          "required": true
        },
        {
          "name": "description",
          "label": "Description",
          "type": "TEXTAREA"
        }
      ]
    },
    {
      "sectionType": "TABLE",
      "sectionName": "Claims",
      "queryReturnType": "MULTIPLE_ROWS",
      "query": "SELECT * FROM RESOURCES;",
      "payload": ["role_id"],
      "applicableActions": ["ADD", "EDIT", "DELETE"],
      "actionConfig": {
        "ADD": {
          "label": "Add New Claim",
          "actionType": "FUNCTION_CALL",
          "functionName": "insertNewRow",
          "onSuccess": "saveChangesAndAddNewRow",
          "onFailure": "showErrorSnackbar"
        },
        "EDIT": {
          "label": "Edit Claim",
          "actionType": "FUNCTION_CALL",
          "functionName": "markRowForUpdate",
          "payload": ["claim_id"],
          "onSuccess": "saveChanges",
          "onFailure": "showErrorSnackbar"
        },
        "DELETE": {
          "label": "Delete Claim",
          "actionType": "EXECUTE_QUERY",
          "query": "Select delete_claim($1, $2) as id;",
          "queryReturnType": "SCALAR",
          "payload": ["claim_id"],
          "onFailure": "showErrorSnackbar"
        }
      },
      "columns": [
        {
          "name": "resource",
          "label": "Resource",
          "type": "TEXT"
        },
        {
          "name": "access_type",
          "label": "Access Type",
          "type": "SELECT",
          "multi": true,
          "selectConfig": {
            "selectHandler": "concatinator",
            "currentSelection": [
              {
                "key": "access_type_ids",
                "as": "id"
              }
            ],
            "selectParser": "splitter",
            "columns":{
                "id":"id",
                "name":"name"
              },
            "options": [
              {
                "id": "READ",
                "name": "READ"
              },
              {
                "id": "ADD",
                "name": "ADD"
              },
              {
                "id": "UPDATE",
                "name": "UPDATE"
              },
              {
                "id": "DELETE",
                "name": "DELETE"
              }
            ],
            "fields_to_extract": [
              {
                "key": "id",
                "as": "access_type_ids"
              },
              {
                "key": "name",
                "as": "access_type_names"
              }
            ]
          }
        },
        {
          "name": "access_level",
          "label": "Access Level",
          "type": "SELECT",
          "multi": false,
          "selectConfig": {
            "selectHandler": "converter",
            "columns":{
                "id":"id",
                "name":"name"
              },
            "currentSelection": [
              {
                "key": "access_level_id",
                "as": "id"
              }
            ],
            "selectParser": "converter",
            "fields_to_extract": [
              {
                "key": "id",
                "as": "access_level_id"
              },
              {
                "key": "name",
                "as": "access_level_name"
              }
            ],
            "options": [
              {
                "id": "PERSONAL",
                "name": "PERSONAL"
              },
              {
                "id": "GLOBAL",
                "name": "GLOBAL"
              }
            ]
          }
        }
      ]
    }
  ]
}
