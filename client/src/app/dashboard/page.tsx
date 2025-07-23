import Bloop from "@/components/page_parts/Bloop";
import BloopPost from "@/components/page_parts/PostBloop";
import { getPosts } from "@/services/API/post.api";
import { get } from "http";


// async function getPostsDashboard(): Promise<any[]> {
//     try {
//         const res = await getPosts();

//         if (!res.ok) {
//             throw new Error("Erreur lors du chargement des posts");
//         }

//         return res.json();
//     } catch (err) {
//         console.error("Erreur dans getPosts:", err);
//         return [];
//     }
// }



export default async function DashboardHome() {

    // const bloops = [
    //     {
    //         profilePicture: "https://randomuser.me/api/portraits/men/1.jpg",
    //         name: "Alice Dupont",
    //         userName: "@alice",
    //         bloopedAt: new Date("2024-06-01T10:00:00Z"),
    //         content: "Premier bloop ! Ravie de rejoindre la plateforme 🚀",
    //         image: "https://picsum.photos/seed/bloop1/400/200",
    //         repliesNb: 3,
    //         likesNb: 15,
    //         rebloopsNb: 2,
    //         saved: true,
    //     },
    //     {
    //         profilePicture: "https://randomuser.me/api/portraits/women/2.jpg",
    //         name: "Bob Martin",
    //         userName: "@bobmartin",
    //         bloopedAt: new Date("2024-06-02T12:30:00Z"),
    //         content: "Quelqu’un a testé la nouvelle fonctionnalité ?",
    //         repliesNb: 1,
    //         likesNb: 7,
    //         rebloopsNb: 0,
    //         saved: false,
    //     },
    //     {
    //         profilePicture: "https://randomuser.me/api/portraits/men/3.jpg",
    //         name: "Chloé Bernard",
    //         userName: "@chloe",
    //         bloopedAt: new Date("2024-06-03T09:15:00Z"),
    //         content: "J’adore l’interface de Bloop 😍",
    //         image: "https://picsum.photos/seed/bloop2/400/200",
    //         repliesNb: 5,
    //         likesNb: 22,
    //         rebloopsNb: 4,
    //         saved: true,
    //     },
    //     {
    //         profilePicture: "https://randomuser.me/api/portraits/women/4.jpg",
    //         name: "David Lefevre",
    //         userName: "@davidl",
    //         bloopedAt: new Date("2024-06-04T14:45:00Z"),
    //         content: "Un café et c’est reparti pour coder ☕️",
    //         repliesNb: 0,
    //         likesNb: 3,
    //         rebloopsNb: 1,
    //         saved: false,
    //     },
    //     {
    //         profilePicture: "https://randomuser.me/api/portraits/men/5.jpg",
    //         name: "Emma Petit",
    //         userName: "@emma",
    //         bloopedAt: new Date("2024-06-05T16:20:00Z"),
    //         content: "Qui participe au hackathon ce week-end ?",
    //         image: "https://picsum.photos/seed/bloop3/400/200",
    //         repliesNb: 2,
    //         likesNb: 10,
    //         rebloopsNb: 3,
    //         saved: false,
    //     },
    // ];

    // const response = await getPostsDashboard();
    // const bloops = response.

    return (
        <div className="flex flex-col items-center md:w-[55%] w-full md:flex-grow-1">
            <BloopPost />
            <div className="bloops w-full ">
                {bloops.map((bloop, index) => (
                    <Bloop key={index} bloopContent={bloop} />
                ))}
            </div>
        </div>
    );
}