import { CategoryInterface } from "../../intefaces/category";
import { AdminServices } from "../../services/admin";
import React, { useEffect, useState } from "react";

interface CategoryItemProps {
  category: CategoryInterface;
  refreshCategories: () => void; // Function to refresh categories
}

const CategoryItem: React.FC<CategoryItemProps> = ({
  category,
  refreshCategories,
}) => {
  const [editing, setEditing] = useState(false);
  const [editedName, setEditedName] = useState(category.name);

  const handleDelete = async () => {
    try {
      await AdminServices.deleteCategory(category.id ?? "");
      refreshCategories(); // Refresh categories after deletion
      // Perform any additional actions after deletion if needed
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const handleEdit = async () => {
    try {
      // Perform edit action, for example:
      const updatedCategory = { ...category, name: editedName };
      await AdminServices.updateCategory(updatedCategory);
      // Perform any additional actions after editing if needed
      setEditing(false);
      refreshCategories(); // Exit edit mode
    } catch (error) {
      console.error("Error editing category:", error);
    }
  };

  useEffect(() => {
    setEditedName(category.name);
  }, [category]);

  return (
    <div className="flex items-center justify-between p-4 text-white border-b border-gray-700">
      {editing ? (
        <input
          className="bg-gray-800 p-2 rounded-sm"
          type="text"
          value={editedName}
          onChange={(e) => setEditedName(e.target.value)}
        />
      ) : (
        <span className="text-white">{category.name}</span>
      )}
      <div>
        {editing ? (
          <>
            <button onClick={handleEdit} className="text-blue-500 mr-2">
              Save
            </button>
            <button onClick={() => setEditing(false)} className="text-gray-500">
              Cancel
            </button>
          </>
        ) : (
          <>
            <button onClick={handleDelete} className="text-red-500 mr-2">
              Delete
            </button>
            <button onClick={() => setEditing(true)} className="text-blue-500">
              Edit
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default CategoryItem;
