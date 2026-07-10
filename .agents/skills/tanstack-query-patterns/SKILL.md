---
name: tanstack-query-patterns
description: TanStack Query (React Query) best patterns for key organization, caching strategies, mutations, and server state management. Activate when building data-driven React applications with server state.
---

# query-key-factories

import { queryOptions } from "@tanstack/react-query";
import { client } from "./client";

const queryKeys = {
all: () => ["contacts"],
getContacts: (page: number, count: number) => [
...queryKeys.all(),
"list",
{ page },
{ count },
],
getContact: (contactId: string | undefined) => [
...queryKeys.all(),
"one",
{ contactId },
],
};

export const getContactsQueryOptions = (page: number, count: number) =>
queryOptions({
queryKey: queryKeys.getContacts(page, count),
queryFn: () => client.getContacts(page, count),
});

export const getOneContactQueryOptions = (contactId?: string) =>
queryOptions({
queryKey: queryKeys.getContact(contactId),
queryFn: () => client.getContact(contactId!),
enabled: contactId !== undefined,
});

import { faker } from "@faker-js/faker";

export type Contact = {
id: string;
firstName: string;
lastName: string;
phoneNumber: string;
address: string;
};

export type GetContactsResponse = {
contacts: Contact[];
};

const sleep = () => new Promise((resolve) => setTimeout(resolve, 500));

const initialContacts = new Array(500).fill(0).map(() => ({
id: faker.string.uuid(),
firstName: faker.person.firstName(),
lastName: faker.person.lastName(),
phoneNumber: faker.phone.number({ style: "international" }),
address: faker.location.secondaryAddress(),
}));

export const client = {
async getContacts(page: number, count: number) {
await sleep();
const { items, pagesCount, hasNext } = paginate(
initialContacts,
page,
count
);
return {
contacts: items,
pagination: { page, pagesCount, hasNext },
};
},
async getContact(contactId: string) {
await sleep();
return initialContacts.find((contact) => contact.id === contactId);
},
};
function paginate<T>(items: T[], page: number, count: number) {
const start = (page - 1) \* count;
const end = start + count;
const paginatedItems = items.slice(start, end);
const pagesCount = Math.ceil(items.length / count);
const hasNext = page < pagesCount;

return { items: paginatedItems, pagesCount, hasNext };
}

import { Alert, Anchor, Button, Card, Pagination, Table } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getContactsQueryOptions } from "../api/query";
import { Spinner } from "./Spinner";

type ContactsTableProps = {
onContactClick: (contactId: string) => void;
};
export const ContactsTable = ({ onContactClick }: ContactsTableProps) => {
const [page, setPage] = useState(1);
const { data, isPending, isError, refetch } = useQuery(
getContactsQueryOptions(page, 50)
);

if (isPending)
return (
<Card withBorder radius={"md"} shadow="md" m="sm">
{isPending && <Spinner />}
</Card>
);

if (isError)
return (
<Alert variant="light" color="red" title="Error loading contacts" m="sm">
<Button color="red" onClick={() => refetch()}>
Try Again
</Button>
</Alert>
);
return (
<Card withBorder radius={"md"} shadow="md" m="sm">

<Table>
<Table.Thead>
<Table.Tr>
<Table.Th>Name</Table.Th>
</Table.Tr>
</Table.Thead>
<Table.Tbody>
{data.contacts.map((contact) => (
<Table.Tr key={contact.id}>
<Table.Td>
<Anchor onClick={() => onContactClick(contact.id)}>
{contact.firstName + " " + contact.lastName}
</Anchor>
</Table.Td>
</Table.Tr>
))}
</Table.Tbody>
</Table>

      <Pagination
        total={data.pagination.pagesCount}
        value={page}
        onChange={setPage}
        className="mx-auto"
      />
    </Card>

);
};

# 12-automatic-query-invalidation

import { notifications } from "@mantine/notifications";
import { IconCircleCheckFilled, IconCircleXFilled } from "@tabler/icons-react";
import { queryOptions, useMutation } from "@tanstack/react-query";
import { client } from "./client";

export const getContactsQueryOptions = (page: number, count: number) =>
queryOptions({
queryKey: ["contacts", "list", { page }, { count }],
queryFn: () => client.getContacts(page, count),
});

export const getOneContactQueryOptions = (contactId?: string) =>
queryOptions({
queryKey: ["contacts", "one", { contactId }],
queryFn: () => client.getContact(contactId!),
enabled: contactId !== undefined,
});

export const useDeleteContact = () =>
useMutation({
mutationFn: (contactId: string) => client.deleteContact(contactId),
meta: {
invalidatesQuery: ["contacts"],
successMessage: "Contact deleted",
errorMessage: "Error deleting contact",
},
});

import { faker } from "@faker-js/faker";

export type Contact = {
id: string;
firstName: string;
lastName: string;
phoneNumber: string;
address: string;
};

export type GetContactsResponse = {
contacts: Contact[];
};

const sleep = () => new Promise((resolve) => setTimeout(resolve, 500));

const LOCAL_STORAGE_KEY = "contacts";

// Load contacts from localStorage or generate and store them
function loadContacts(): Contact[] {
const data = localStorage.getItem(LOCAL_STORAGE_KEY);
if (data) {
try {
return JSON.parse(data) as Contact[];
} catch {
localStorage.removeItem(LOCAL_STORAGE_KEY); // clean up bad data
}
}
const generated = new Array(500).fill(0).map(() => ({
id: faker.string.uuid(),
firstName: faker.person.firstName(),
lastName: faker.person.lastName(),
phoneNumber: faker.phone.number({ style: "international" }),
address: faker.location.secondaryAddress(),
}));
localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(generated));
return generated;
}

// Save contacts to localStorage
function saveContacts(updatedContacts: Contact[]) {
localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedContacts));
}

// Contacts are loaded once and used throughout
let contacts = loadContacts();

export const client = {
async getContacts(page: number, count: number) {
await sleep();
const { items, pagesCount, hasNext } = paginate(contacts, page, count);
return {
contacts: items,
pagination: { page, pagesCount, hasNext },
};
},

async getContact(contactId: string) {
await sleep();
return contacts.find((contact) => contact.id === contactId);
},

async deleteContact(contactId: string) {
await sleep();
contacts = contacts.filter((contact) => contact.id !== contactId);
saveContacts(contacts);
},
};

function paginate<T>(items: T[], page: number, count: number) {
const start = (page - 1) \* count;
const end = start + count;
const paginatedItems = items.slice(start, end);
const pagesCount = Math.ceil(items.length / count);
const hasNext = page < pagesCount;

return { items: paginatedItems, pagesCount, hasNext };
}

import { notifications } from "@mantine/notifications";
import { IconCircleCheckFilled, IconCircleXFilled } from "@tabler/icons-react";
import {
MutationCache,
QueryClient,
QueryClientProvider,
QueryKey,
} from "@tanstack/react-query";
import { ContactsPage } from "./components/ContactsPage";

declare module "@tanstack/react-query" {
interface Register {
mutationMeta: {
invalidatesQuery?: QueryKey;
successMessage?: string;
errorMessage?: string;
};
}
}

const queryClient = new QueryClient({
mutationCache: new MutationCache({
onSuccess: (\_data, \_variables, \_context, mutation) => {
if (mutation.meta?.successMessage) {
notifications.show({
icon: <IconCircleCheckFilled />,
color: "green",
message: mutation.meta?.successMessage,
});
}
},

    onError: (_error, _variables, _context, mutation) => {
      if (mutation.meta?.errorMessage) {
        notifications.show({
          icon: <IconCircleXFilled />,
          color: "red",
          message: mutation.meta?.errorMessage,
        });
      }
    },
    onSettled: (_data, _error, _variables, _context, mutation) => {
      {
        if (mutation.meta?.invalidatesQuery) {
          queryClient.invalidateQueries({
            queryKey: mutation.meta?.invalidatesQuery,
          });
        }
      }
    },

}),
});

export default function Pattern() {
return (
<QueryClientProvider client={queryClient}>
<ContactsPage />
</QueryClientProvider>
);
}
