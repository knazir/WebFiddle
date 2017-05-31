class Api {
  static _get(url, onSuccess, onFailure) {
    return fetch(url)
      .then(response => response.json())
      .then(onSuccess, onFailure);
  }

  static getUser(username, password, onSuccess, onFailure) {
    const user = {
      username: username,
      projects: [
        {name: "Simple Project"},
        {name: "Hello World"},
        {name: "HW1"},
        {name: "HW2"},
        {name: "HW3"}
      ]
    };
    onSuccess(user);
  }

  static getProject(username, projectName, onSuccess, onFailure) {
    const project = {
      name: projectName,
      id: (Math.floor(Math.random() * 1000000) + 1).toString(),
      files: [
        {type: "file", filename: "index.html"},
        {type: "file", filename: "app.js"},
        {type: "file", filename: "main.css"}
      ]
    };
    onSuccess(project);
  }
}