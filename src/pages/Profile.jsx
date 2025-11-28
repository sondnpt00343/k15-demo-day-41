import { useMeQuery } from "@/services/auth";

function Profile() {
    const { isSuccess, data: currentUser } = useMeQuery();

    return (
        <div>
            <h1>Profile</h1>
            {isSuccess && <h2>Hi, {currentUser.firstName}</h2>}
        </div>
    );
}

export default Profile;
