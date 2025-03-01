import React, { useState, useEffect } from 'react';
import { fetchCategories, fetchSubcategories } from './utils/backend.ts';
import TableView from './TableView';

const ConfigView = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchCategoriesAndSubcategories = async () => {
      try {
        const [categories, subcategories] = await Promise.all([
          fetchCategories(),
          fetchSubcategories()
        ]);

        const mergedData = subcategories.map(subcategory => {
          const category = categories.find(cat => cat.id === subcategory.category_id);
          return {
            id: subcategory.id,
            subcategory_name: subcategory.name,
            category_name: category ? category.name : 'Unknown',
            category_id: subcategory.category_id
          };
        });

        setData(mergedData);
      } catch (error) {
        console.error('Error fetching categories and subcategories:', error);
      }
    };

    fetchCategoriesAndSubcategories();
  }, []);

  const columns = [
    { id: 'id', header: 'ID', accessorKey: 'id' },
    { id: 'subcategory_name', header: 'Subcategory Name', accessorKey: 'subcategory_name' },
    { id: 'category_name', header: 'Category Name', accessorKey: 'category_name' },
    { id: 'category_id', header: 'Category ID', accessorKey: 'category_id' },
  ];

  return (
    <div>
      <h3>Subcategories</h3>
      <TableView columns={columns} data={data} />
    </div>
  );
};

export default ConfigView;