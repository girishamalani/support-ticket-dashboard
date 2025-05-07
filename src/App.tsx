import React, { useEffect, useState, createContext, useContext } from 'react';
import rawData from './data/sampleTickets.json';
const sampleTickets = rawData as Ticket[];

// import sampleTickets from './data/sampleTickets.json';

// Types
export interface Ticket {
  id: string;
  title: string;
  customer: string;
  customerEmail: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In Progress' | 'Closed';
  createdAt: string;
  updatedAt: string;
  description: string;
  category: string;
}

// Context
const TicketContext = createContext({} as {
  tickets: Ticket[];
  updateStatus: (id: string, newStatus: Ticket['status']) => void;
  setFilter: (filter: string) => void;
  setSearch: (search: string) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
});

export const useTickets = () => useContext(TicketContext);

// App Component
const App: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setTimeout(() => {
      setTickets(sampleTickets);
    }, 500);
  }, []);

  const updateStatus = (id: string, newStatus: Ticket['status']) => {
    setTickets(prev =>
      prev.map(ticket =>
        ticket.id === id ? { ...ticket, status: newStatus } : ticket
      )
    );
  };

  return (
    <TicketContext.Provider value={{ tickets, updateStatus, setFilter, setSearch, currentPage, setCurrentPage }}>
      <div className="p-4 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Support Ticket Dashboard</h1>
        <Filters />
        <TicketList filter={filter} search={search} />
      </div>
    </TicketContext.Provider>
  );
};

// Filters Component
const Filters: React.FC = () => {
  const { setFilter, setSearch, setCurrentPage } = useTickets();

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="flex gap-4 mb-4">
      <select onChange={handleFilterChange} className="border px-2 py-1 rounded">
        <option value="All">All</option>
        <option value="Open">Open</option>
        <option value="In Progress">In Progress</option>
        <option value="Closed">Closed</option>
      </select>
      <input
        type="text"
        placeholder="Search by title or customer"
        onChange={handleSearchChange}
        className="border px-2 py-1 rounded w-full"
      />
    </div>
  );
};

// Ticket List
const TicketList: React.FC<{ filter: string; search: string }> = ({ filter, search }) => {
  const { tickets, currentPage, setCurrentPage } = useTickets();

  const filteredTickets = tickets.filter(ticket => {
    const matchesFilter = filter === 'All' || ticket.status === filter;
    const matchesSearch = ticket.title.toLowerCase().includes(search.toLowerCase()) ||
                          ticket.customer.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const ticketsPerPage = 5;
  const indexOfLast = currentPage * ticketsPerPage;
  const indexOfFirst = indexOfLast - ticketsPerPage;
  const currentTickets = filteredTickets.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredTickets.length / ticketsPerPage);

  return (
    <div className="grid gap-4">
      {currentTickets.map(ticket => (
        <TicketCard key={ticket.id} ticket={ticket} />
      ))}
      <div className="flex gap-2 justify-center mt-4">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

// Ticket Card
const TicketCard: React.FC<{ ticket: Ticket }> = ({ ticket }) => {
  const { updateStatus } = useTickets();
  return (
    <div className="border rounded-xl p-4 shadow">
      <div className="flex justify-between">
        <div>
          <h2 className="text-lg font-semibold">{ticket.title}</h2>
          <p className="text-sm text-gray-500">{ticket.customer}</p>
        </div>
        <select
          className="border px-2 py-1 rounded"
          value={ticket.status}
          onChange={e => updateStatus(ticket.id, e.target.value as Ticket['status'])}
        >
          <option>Open</option>
          <option>In Progress</option>
          <option>Closed</option>
        </select>
      </div>
      <p className="mt-2 text-sm text-gray-700">{ticket.description}</p>
    </div>
  );
};

export default App;
