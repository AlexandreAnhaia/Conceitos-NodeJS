const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateProjectId(request, response, next) {
  const { id } = request.params;

  if(!isUuid(id)){
      return response.status(400).json({error: 'Invalid project ID'});
  }
  return next();
}

app.get("/repositories", (request, response) => {
  // const { title } = request.query;
    
  // const results = title ? repositories.filter(repository => repository.title.includes(title)) : repositories;

  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const {title, url, techs } = request.body;

    const repository = {id: uuid(), title, url, techs, likes: 0 };

    repositories.push(repository);

    return response.json(repository);
});

app.put("/repositories/:id", validateProjectId, (request, response) => {
  const { id } = request.params;
  const {title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  
  if(repositoryIndex < 0) {
      return response.status(400).json({error: "Repository not found"});
  }

  const repository = {  
    id,    
    title,
    url,
    techs,
    likes: repositories[repositoryIndex].likes
  };

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", validateProjectId, (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  
  if(repositoryIndex >= 0) {
    repositories.splice(repositoryIndex, 1);
  } else {
    return response.status(400).json({error: 'Repository does not exists.'})
  }
  return response.status(204).send();
});

app.post("/repositories/:id/like", validateProjectId, (request, response) => {
  const { id } = request.params;  

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  
  if(repositoryIndex < 0) {
      return response.status(400).json({error: "Repository not found"})
  }

  repositories[repositoryIndex].likes++;

  return response.json(repositories[repositoryIndex]);
});

module.exports = app;
