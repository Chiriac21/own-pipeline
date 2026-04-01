import { Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'

export const Users = ({users}) => {
    return (
        <div className='container'>
        <h2>Users</h2>
        <Table striped>
            <tbody>
                <tr><td></td><td><b>blogs created</b></td></tr>
            {users.map(user => 
                <tr key={user.id}>
                    <td>
                        <Link to={`/users/${user.id}`}>{user.name}</Link>
                    </td>
                    <td>
                        {user.blogs.length}
                    </td>
                </tr>
            )}
            </tbody>
        </Table>
        </div>
    )
}

export const User = ({user}) => {
    if (!user) {
        return null
    }

    const blogs = user.blogs;
    return (
     <div className='container'>
     <h2>{user.name}</h2>
     <h5>added blogs</h5>
     <ul>
        {
        blogs.map(blog => <li key={blog.id}>{blog.title}</li>)
        }
     </ul>
     </div>
    )
}


export default Users