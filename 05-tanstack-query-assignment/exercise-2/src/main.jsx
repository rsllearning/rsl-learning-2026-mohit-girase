import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import './styles.css';

const queryClient = new QueryClient();

let USERS_DATABASE = [
  { id: 1, name: 'Alice Smith', email: 'alice@example.com', role: 'Admin' },
  { id: 2, name: 'Bob Jones', email: 'bob@example.com', role: 'User' },
  { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', role: 'Manager' },
];

async function apiFetchUsers() {
  await new Promise((res) => setTimeout(res, 400));
  return [...USERS_DATABASE];
}

async function apiCreateUser(user) {
  await new Promise((res) => setTimeout(res, 500));
  const created = { ...user, id: Date.now() };
  USERS_DATABASE = [...USERS_DATABASE, created];
  return created;
}

async function apiDeleteUser(userId, shouldFail) {
  await new Promise((res) => setTimeout(res, 500));
  if (shouldFail) {
    throw new Error('Simulated delete failure on server.');
  }
  USERS_DATABASE = USERS_DATABASE.filter((u) => u.id !== userId);
  return { success: true, id: userId };
}

function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: apiFetchUsers,
  });
}

function useCreateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: apiCreateUser,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, shouldFail }) => apiDeleteUser(userId, shouldFail),
    onMutate: async ({ userId }) => {
      await qc.cancelQueries({ queryKey: ['users'] });
      const previousUsers = qc.getQueryData(['users']);
      qc.setQueryData(['users'], (old) =>
        old ? old.filter((u) => u.id !== userId) : []
      );
      return { previousUsers };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousUsers) {
        qc.setQueryData(['users'], context.previousUsers);
      }
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

function UserManagement() {
  const { data: users, isPending, isError, error } = useUsers();
  const createUserMutation = useCreateUser();
  const deleteUserMutation = useDeleteUser();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('User');
  const [simulateDeleteFail, setSimulateDeleteFail] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email) return;
    createUserMutation.mutate(
      { name, email, role },
      {
        onSuccess: () => {
          setName('');
          setEmail('');
          setRole('User');
        },
      }
    );
  };

  return (
    <div className="container">
      <h1>Exercise 2: User Management</h1>
      <p className="hint">
        Mutations, invalidation, and optimistic updates with TanStack Query.
      </p>

      <form className="panel" onSubmit={handleSubmit}>
        <h3>Add User</h3>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="User">User</option>
          <option value="Admin">Admin</option>
          <option value="Manager">Manager</option>
        </select>
        <button type="submit" disabled={createUserMutation.isPending}>
          {createUserMutation.isPending ? 'Creating...' : 'Create User'}
        </button>

        {createUserMutation.isSuccess && (
          <div className="message">User created successfully!</div>
        )}
        {createUserMutation.isError && (
          <div className="error">
            Failed to create user: {createUserMutation.error?.message}
          </div>
        )}
      </form>

      <div style={{ margin: '15px 0' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="checkbox"
            checked={simulateDeleteFail}
            onChange={(e) => setSimulateDeleteFail(e.target.checked)}
          />
          Simulate Delete Failure (to test rollback)
        </label>
        {deleteUserMutation.isError && (
          <div className="error" style={{ marginTop: '8px' }}>
            Delete failed: {deleteUserMutation.error?.message} (Rollback executed)
          </div>
        )}
      </div>

      {isPending && <div className="message">Loading users...</div>}
      {isError && (
        <div className="error">Failed to fetch users: {error?.message}</div>
      )}

      {users && (
        <div className="list">
          {users.map((user) => (
            <div key={user.id} className="user">
              <div>
                <strong>{user.name}</strong>
                <span>{user.email}</span>
                <small>Role: {user.role}</small>
              </div>
              <button
                type="button"
                onClick={() =>
                  deleteUserMutation.mutate({
                    userId: user.id,
                    shouldFail: simulateDeleteFail,
                  })
                }
              >
                Delete
              </button>
            </div>
          ))}
          {users.length === 0 && <p className="hint">No users found.</p>}
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserManagement />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

createRoot(document.getElementById('root')).render(<App />);
