import Home from './components/Home';

function App() {
  const server_url = 'https://scrapy-two.vercel.app'
  return (
    <div className="App">
      <Home server_url={server_url}/>
    </div>
  );
}

export default App;
