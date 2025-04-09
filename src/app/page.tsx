'use client';
import { useEffect, useState } from 'react';

type ItemType = {
  _id: string;
  text: string;
  date: string;
};

export default function Home() {
  const [data, setData] = useState<ItemType[]>([]);

  const fetchItems = async () => {
    const res = await fetch('/api/items');
    const json = await res.json();
    setData(json);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleClick = async () => {
    const input = document.getElementById('inputId') as HTMLInputElement;
    if (input?.value.trim()) {
      const res = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input.value }),
      });
      const newItem = await res.json();
      setData(prev => [...prev, newItem]);
      input.value = '';
    }
  };

  const handleDone = async (id: string) => {
    const res = await fetch(`/api/items/${id}`, {
      method: 'PUT',
    });
    const updated = await res.json();
    setData(prev =>
      prev.map(item => (item._id === id ? updated : item))
    );
  };

  const handleRemove = async (id: string) => {
    await fetch(`/api/items/${id}`, {
      method: 'DELETE',
    });
    setData(prev => prev.filter(item => item._id !== id));
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  return (
    <div className="py-5 px-4 text-white">
      <div className="flex justify-center items-center">
        <div className="flex gap-5">
          <input
            type="text"
            className="border border-white p-2 rounded-md bg-transparent text-white placeholder-white outline-0"
            id="inputId"
            placeholder="Enter item"
          />
          <button
            className="bg-blue-600 rounded-sm px-5 font-bold"
            onClick={handleClick}
          >
            Add
          </button>
        </div>
      </div>

      <div className="py-4">
        {data.map(item => {
          const itemDate = new Date(item.date);
          return (
            itemDate.getTime() < tomorrow.getTime() && (
              <div className="flex justify-between items-center" key={item._id}>
                <span className="w-full border-2 border-black p-2 m-2">
                  {item.text}
                </span>
                <div className="flex gap-2">
                  <button
                    className="bg-green-400 rounded-sm px-5 py-1 font-bold"
                    onClick={() => handleDone(item._id)}
                  >
                    Done
                  </button>
                  <button
                    className="bg-red-600 rounded-sm px-5 py-1 font-bold"
                    onClick={() => handleRemove(item._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            )
          );
        })}
      </div>
    </div>
  );
}
