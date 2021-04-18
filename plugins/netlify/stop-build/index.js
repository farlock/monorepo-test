module.exports = {
  onPreBuild: ({ utils }) => {
    const currentProject = process.env.PROJECT_NAME;
    const lastDeployedCommit = process.env.CACHED_COMMIT_REF;
    console.log('lastDeployedCommit', lastDeployedCommit);
    const latestCommit = 'HEAD';
    const projectHasChanged = projectChanged(
      currentProject,
      lastDeployedCommit,
      latestCommit
    );
    if (!projectHasChanged) {
      utils.build.cancelBuild(
        `Build was cancelled because ${currentProject} was not affected by the latest changes`
      );
    }
  },
};

function projectChanged(currentProject, fromHash, toHash) {
  const execSync = require('child_process').execSync;
  const getAffected = `yarn --silent nx print-affected --base=bccb22d57d1d85de963923b53bc2d1f6bc407940 --head=HEAD`;
  const output = execSync(getAffected).toString();
  //get the list of changed projects from the output.
  const changedProjects = JSON.parse(output).projects;
  console.log(changedProjects.find((project) => project === currentProject));
  if (changedProjects.find((project) => project === currentProject)) {
    return true;
  } else {
    return false;
  }
}
