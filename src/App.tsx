import {  useState } from 'react';
import users from './users.json';
import DragArea from './components/DragArea';
import DragItem from './components/DragItem';

type UserProps = {
  name?: string;
  email?: string;
};

const UserItem = ({ name, email }: UserProps) => {
  return (
    <li>
      <span>{name}</span><br />
      <span>{email}</span>
    </li>
  );
};

function App() {
  const [exampleUsers, setExampleUsers] = useState(users);
  return (
    <DragArea
      //   classes={{
      // width: '300px',
      //   }}
      items={exampleUsers}
      onChange={setExampleUsers}
    >
      {exampleUsers.map((user, index) => (
        <DragItem
          key={user.id}
          // classes={{
          //   backgroundColor: "red"
          // }}
          note={index}
        >
          <UserItem
            name={
              user.firstName
            }
            email={user.email}
          />
        </DragItem>
      ))}
    </DragArea>
  );
}

export default App;
