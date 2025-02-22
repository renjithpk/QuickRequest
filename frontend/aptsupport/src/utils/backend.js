import axios from 'axios';

const BASE_URL = "http://127.0.0.1:8000";

async function createCategory(name) {
    const url = `${BASE_URL}/categories/`;
    const payload = { name: name };
    const response = await axios.post(url, payload);
    return response.data;
}

async function createSubcategory(name, categoryId) {
    const url = `${BASE_URL}/subcategories/`;
    const payload = { name: name, category_id: categoryId };
    const response = await axios.post(url, payload);
    return response.data;
}

async function createTicket(title, description, categoryId, subcategoryId, deadline) {
    const url = `${BASE_URL}/tickets/`;
    const payload = {
        title: title,
        description: description,
        category_id: categoryId,
        subcategory_id: subcategoryId,
        deadline: deadline
    };
    const response = await axios.post(url, payload);
    return response.data;
}

async function updateTicket(ticketId, status, resolved) {
    const url = `${BASE_URL}/tickets/${ticketId}`;
    const payload = { status: status, resolved: resolved };
    const response = await axios.put(url, payload);
    return response.data;
}

async function deleteTicket(ticketId) {
    const url = `${BASE_URL}/tickets/${ticketId}`;
    const response = await axios.delete(url);
    return response.data;
}

async function fetchCategories() {
    const url = `${BASE_URL}/categories/`;
    const response = await axios.get(url);
    return response.data;
}

async function fetchSubcategories() {
    const url = `${BASE_URL}/subcategories/`;
    const response = await axios.get(url);
    return response.data;
}

async function fetchTickets() {
    const url = `${BASE_URL}/tickets/`;
    const response = await axios.get(url);
    return response.data;
}

export {
    createCategory,
    createSubcategory,
    createTicket,
    updateTicket,
    deleteTicket,
    fetchCategories,
    fetchSubcategories,
    fetchTickets
};