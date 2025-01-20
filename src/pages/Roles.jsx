import { useEffect, useState } from "react";
import { _get, _post, _put, _delete } from "../api";
import Logout from "../components/Logout";

const Roles = () => {

    const [roles, setRoles] = useState([]);
    const [name, setName] = useState("");

    useEffect(() => {
        _get("/roles").then((res) => {
            setRoles(res.data);
        });
    }, []);

    const saveRole = () => {
        _post("/roles", { name }).then((res) => {
            setRoles([...roles, res.data]);
            setName("");
        }).catch((err) => {
            console.log(err);
        });
    }

    const deleteRole = (id) => {
        _delete(`/roles/${id}`).then((res) => {
            setRoles(roles.filter((role) => role.id !== id));
        }).catch((err) => {
            console.log(err);
        });
    }

    return (
    <div className="w-screen h-auto min-h-screen flex items-center justify-center">
        <Logout />
        <div className="w-fit flex flex-col gap-4 rounded-md border border-gray-300 p-4">
            <div className="flex flex-col">
                <p>Name</p>
                <input onChange={(e) => setName(e.target.value)} value={name} placeholder="Name" type="text" className="w-96 px-4 py-2 rounded-md text-sm border border-gray-300" />
            </div>
            <button onClick={saveRole} className="w-full px-4 py-2 text-sm text-white rounded-md bg-blue-600">Save</button>
        </div>

        <div>
            <table className="w-full">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {roles.map((role) => (
                         <tr key={role.id}>
                            <td>{role.name}</td>
                            <td>
                                <button className="px-4 py-2 text-sm text-white rounded-md bg-blue-600">Edit</button>
                                <button onClick={() => deleteRole(role.id)} className="px-4 py-2 text-sm text-white rounded-md bg-red-600">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
    );
}

export default Roles;
