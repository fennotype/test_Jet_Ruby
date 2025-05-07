export const loadAllRepos = async () => {
    try {
      const response = await fetch('http://localhost:3000/repositories');
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error('Ошибка при загрузке данных. Попробуйте позже.');
    }
  };
  
  export const searchRepos = async (searchInput) => {
    try {
      const response = await fetch(`http://localhost:3000/repositories/${searchInput}`);
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error('Ошибка при поиске. Попробуйте позже.');
    }
  };