import db from "@/lib/db";
import Request from "./components/Request";

export default async function Dashboard() {
  const requests = await db.attend.findMany({
    include: {
      event: true,
      user: true,
    },
    orderBy: {
      status: "asc",
    },
  });

  return (
    <div className="p-8">
      <h1 className="text-3xl font-semibold mb-4">Attend Requests</h1>
      <div className="flex flex-col md:flex-row md:flex-wrap gap-2">
        {requests.map((request) => {
          return (
            <Request
              key={request.id}
              id={request.id}
              user={request.user}
              status={request.status}
              event={request.event}
            />
          );
        })}
      </div>
    </div>
  );
}
