import axios from 'axios';

const BASE_URL = "http://127.0.0.1:8000";

interface Category {
    id: number;
    name: string;
}

interface Subcategory {
    id: number;
    name: string;
    category_id: number;
}

interface Ticket {
    id: number;
    title: string;
    description: string;
    category_id: number;
    subcategory_id: number;
    deadline: string;
    status: string;
    resolved: boolean;
}

// Fetch Single Category
async function fetchCategory(categoryId: number): Promise<Category> {
    const url = `${BASE_URL}/categories/${categoryId}`;
    const response = await axios.get<Category>(url);
    return response.data;
}

async function updateCategory(categoryId: number, name: string): Promise<Category> {
    const url = `${BASE_URL}/categories/${categoryId}`;
    const payload = { name };
    const response = await axios.put<Category>(url, payload);
    return response.data;
}

async function deleteCategory(categoryId: number): Promise<void> {
    const url = `${BASE_URL}/categories/${categoryId}`;
    await axios.delete(url);
}

// Fetch Single Subcategory
async function fetchSubcategory(subcategoryId: number): Promise<Subcategory> {
    const url = `${BASE_URL}/subcategories/${subcategoryId}`;
    const response = await axios.get<Subcategory>(url);
    return response.data;
}

async function updateSubcategory(subcategoryId: number, name: string, categoryId: number): Promise<Subcategory> {
    const url = `${BASE_URL}/subcategories/${subcategoryId}`;
    const payload = { name, category_id: categoryId };
    const response = await axios.put<Subcategory>(url, payload);
    return response.data;
}

async function deleteSubcategory(subcategoryId: number): Promise<void> {
    const url = `${BASE_URL}/subcategories/${subcategoryId}`;
    await axios.delete(url);
}

// Fetch Single Ticket
async function fetchTicket(ticketId: number): Promise<Ticket> {
    const url = `${BASE_URL}/tickets/${ticketId}`;
    const response = await axios.get<Ticket>(url);
    return response.data;
}

async function fetchTicketsByStatus(status: string): Promise<Ticket[]> {
    const url = `${BASE_URL}/tickets/status/${status}`;
    const response = await axios.get<Ticket[]>(url);
    return response.data;
}

async function fetchOverdueTickets(): Promise<Ticket[]> {
    const url = `${BASE_URL}/tickets/overdue/`;
    const response = await axios.get<Ticket[]>(url);
    return response.data;
}

async function createCategory(name: string): Promise<Category> {
    const url = `${BASE_URL}/categories/`;
    const payload = { name };
    const response = await axios.post<Category>(url, payload);
    return response.data;
}

async function createSubcategory(name: string, categoryId: number): Promise<Subcategory> {
    const url = `${BASE_URL}/subcategories/`;
    const payload = { name, category_id: categoryId };
    const response = await axios.post<Subcategory>(url, payload);
    return response.data;
}

async function createTicket(
    title: string,
    description: string,
    categoryId: number,
    subcategoryId: number,
    deadline: string
): Promise<Ticket> {
    const url = `${BASE_URL}/tickets/`;
    const payload = { title, description, category_id: categoryId, subcategory_id: subcategoryId, deadline };
    const response = await axios.post<Ticket>(url, payload);
    return response.data;
}

async function updateTicket(
    ticketId: number,
    status?: string,
    resolved?: boolean,
    title?: string,
    description?: string,
    categoryId?: number,
    subcategoryId?: number,
    deadline?: string
): Promise<Ticket> {
    const url = `${BASE_URL}/tickets/${ticketId}`;
    const payload = { status, resolved, title, description, category_id: categoryId, subcategory_id: subcategoryId, deadline };
    const response = await axios.put<Ticket>(url, payload);
    return response.data;
}

async function deleteTicket(ticketId: number): Promise<void> {
    const url = `${BASE_URL}/tickets/${ticketId}`;
    await axios.delete(url);
}

async function fetchCategories(): Promise<Category[]> {
    const url = `${BASE_URL}/categories/`;
    const response = await axios.get<Category[]>(url);
    return response.data;
}

async function fetchSubcategories(): Promise<Subcategory[]> {
    const url = `${BASE_URL}/subcategories/`;
    const response = await axios.get<Subcategory[]>(url);
    return response.data;
}

async function fetchTickets(): Promise<Ticket[]> {
    const url = `${BASE_URL}/tickets/`;
    const response = await axios.get<Ticket[]>(url);
    return response.data;
}

export {
    createCategory,
    createSubcategory,
    createTicket,
    deleteCategory,
    deleteSubcategory,
    deleteTicket,
    fetchCategory,
    fetchCategories,
    fetchOverdueTickets,
    fetchSubcategory,
    fetchSubcategories,
    fetchTicket,
    fetchTickets,
    fetchTicketsByStatus,
    updateCategory,
    updateSubcategory,
    updateTicket,
    Category,
    Subcategory,
    Ticket,
};
