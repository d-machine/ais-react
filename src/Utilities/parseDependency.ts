const dependencies = [
  {
    dependency: "party",
    fields: [
      { as: "party_id", key: "id" },
      { as: "party_address", key: "address" },
    ],
  },
  {
    dependency: "state",
    fields: [
      { as: "state_id", key: "id" },
      { as: "state_name", key: "name" },
    ],
  },
];

const data = {
  party: { id: 1, name: "Party 1", address: "Address 1" },
  state: { id: 1, name: "State 1" },
};

function parseDependencies(dependencies, data) {
    // console.log(dependencies, 'dependencies');
    const _dependenciesData = {};
    _.forEach(dependencies, ({ dependency, fields }) => {
        // console.log({dependency, fields}, 'dependency, fields');

        const dependencyData = data?.[dependency];
        // console.log(dependencyData, 'dependencyData');
        
        _.forEach(fields, field => {
            _dependenciesData[field.as] = _.get(dependencyData, field.key);
            // console.log(_dependenciesData);
        });
    });
    return _dependenciesData;
}

console.log(parseDependencies(dependencies, data), 'parseDependencies');