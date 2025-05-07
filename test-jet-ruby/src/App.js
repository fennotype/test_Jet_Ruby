import React, { useState, useEffect } from 'react';
import './App.css';
import { loadAllRepos, searchRepos } from './api';
import { RiGitRepositoryFill } from "react-icons/ri";

function App() {
  const [repos, setRepos] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    handleLoadAllRepos();
  }, []);

  const handleLoadAllRepos = async () => {
    setError('');
    setRepos([]);
    try {
      const data = await loadAllRepos();
      if (data.Message) {
        setError(data.Message);
      } else {
        setRepos(data);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSearchRepos = async () => {
    if (!searchInput) {
      handleLoadAllRepos();
      return;
    }

    setError('');
    setRepos([]);
    try {
      const data = await searchRepos(searchInput);
      if (data.Message) {
        setError(data.Message);
      } else {
        setRepos(data);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="container">
      <h1>Поиск репозиториев</h1>

      <div className="search-box">
        <input
          type="text"
          value={searchInput}
          placeholder="ID или название репозитория"
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button onClick={handleSearchRepos}>Поиск</button>
      </div>

      {error && <div className="results error">{error}</div>}

      {repos.length > 0 && (
        <table id="reposTable">
          <thead>
            <tr>
              <th>ID</th>
              <th>Название</th>
              <th>Ссылка</th>
              <th>Описание</th>
              <th>Язык</th>
              <th>Количество звезд</th>
            </tr>
          </thead>
          <tbody>
            {repos.map((repo) => (
              <tr key={repo.id}>
                <td>{repo.id}</td>
                <td>{repo.name}</td>
                <td>
                  <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                    {repo.html_url}
                  </a>
                </td>
                <td>{repo.description || 'Нет описания'}</td>
                <td>{repo.language}</td>
                <td>{repo.stargazers_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;