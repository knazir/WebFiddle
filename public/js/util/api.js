class Api {
  static _makeRequest(method, path, onSuccess, onFailure, body) {
    const opts = {
      method: method,
      credentials: "include",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(body)
    };

    return fetch(`http://localhost:3000${path}`, opts)
      .then(response => response.json())
      .then(onSuccess, onFailure);
  }

  static _get(path, onSuccess, onFailure) {
    return Api._makeRequest("get", path, onSuccess, onFailure);
  }

  /*
   * TODO: Change to "patch" as it makes more sense semantically?
   */
  static _patch(path, onSuccess, onFailure, body) {
    return Api._makeRequest("patch", path, onSuccess, onFailure, body);
  }

  static _post(path, onSuccess, onFailure, body) {
    return Api._makeRequest("post", path, onSuccess, onFailure, body);
  }

  /*
   * TODO: Be more secure about passwords...
   */
  static getUser(username, password, onSuccess, onFailure) {
    return Api._get(`/users/${username}`, onSuccess, onFailure);
  }

  static getProject(username, projectId, onSuccess, onFailure) {
    return Api._get(`/users/${username}/projects/${projectId}`, onSuccess, onFailure);
  }

  static getFile(username, projectId, fileId, onSuccess, onFailure) {
    return Api._get(`/users/${username}/projects/${projectId}/files/${fileId}`, onSuccess, onFailure);
  }

  static updateFile(username, projectId, fileId, fileContents, onSuccess, onFailure) {
    return Api._post(`/users/${username}/projects/${projectId}/files/${fileId}/update`, onSuccess, onFailure,
      {contents: fileContents});
  }

  static toggleProjectPublished(username, projectId, onSuccess, onFailure) {
    return Api._post(`/users/${username}/projects/${projectId}/publish/toggle`, onSuccess, onFailure);
  }
}