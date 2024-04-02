import axios from "axios"
import { interfaceNote } from "../model/interfaceNote"
const baseURL:string = 'http://localhost:3001/api/notes'

const getAll = () => {
    const request = axios.get<interfaceNote[]>(baseURL);

    const nonExisting:interfaceNote = {
        id: String(10000),
        content: 'This note is not saved to server',
        important: true,
    }

    return request.then(response => {
        return response.data.concat(nonExisting);
    }); // Compact expression verison
    
    // // Regular version
    // return request.then(response => {
    //     return response.data
    // })
}

const create = (newObject:interfaceNote) => {
    const request = axios.post<interfaceNote>(baseURL, newObject);
    return request.then(response => response.data);
}

const update = (id: string, newObject: interfaceNote) => {
    const request = axios.put<interfaceNote>(`${baseURL}/${id}`, newObject);
    return request.then(response => response.data);
}

export default { getAll, create, update }