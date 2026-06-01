export default function Dashboard() {
  const user = JSON.parse(
    localStorage.getItem("user")
  );

  return (
    <div>
      <h1>
        Welcome {user?.fullName}
      </h1>
    </div>
  );
}