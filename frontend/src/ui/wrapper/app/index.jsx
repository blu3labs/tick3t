import "./index.css"

export default function AppWrapper({ children }) {
  return (
    <div className="app">
      <div className="appContent">{children}</div>
    </div>
  );
}
