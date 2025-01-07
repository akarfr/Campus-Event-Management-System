import db from "@/lib/db";

export default async function Dashboard() {

    const requests = await db.attend.findMany({
        where: {
            approved: false
        },
        include: {
            event: true,
            user: true
        }
    });

    return (
        <div>{requests.map((request) => {
            return (
                <div key={request.id}>
                    <h1>{request.event.name}</h1>
                    <p>{request.user.email}</p>
                </div>
            )
        })}</div>
    )
}