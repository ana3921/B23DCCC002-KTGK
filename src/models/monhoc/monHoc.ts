import { v4 as uuidv4 } from 'uuid';
import { useState, useEffect } from 'react';

export interface MonHoc {
	id: string;
	name: string;
	description: string;
	credits: number;
}

export const getStoredMonHocs = (): MonHoc[] => {
	const storedMonHocs = localStorage.getItem('monHocs');
	return storedMonHocs ? JSON.parse(storedMonHocs) : [];
};

export const storeMonHocs = (monHocs: MonHoc[]) => {
	localStorage.setItem('monHocs', JSON.stringify(monHocs));
};

export const createMonHoc = (values: Omit<MonHoc, 'id'>): MonHoc => {
	return {
		id: uuidv4(),
		...values,
	};
};

const useMonHocs = () => {
	const [monHocs, setMonHocs] = useState<MonHoc[]>([]);

	useEffect(() => {
		setMonHocs(getStoredMonHocs());
	}, []);

	useEffect(() => {
		storeMonHocs(monHocs);
	}, [monHocs]);

	const addMonHoc = (values: Omit<MonHoc, 'id'>) => {
		const newMonHoc = createMonHoc(values);
		setMonHocs([...monHocs, newMonHoc]);
	};

	const updateMonHoc = (id: string, values: Omit<MonHoc, 'id'>) => {
		setMonHocs(monHocs.map((monHoc) => (monHoc.id === id ? { ...monHoc, ...values } : monHoc)));
	};

	const deleteMonHoc = (id: string) => {
		setMonHocs(monHocs.filter((monHoc) => monHoc.id !== id));
	};

	return {
		monHocs,
		addMonHoc,
		updateMonHoc,
		deleteMonHoc,
	};
};

export default useMonHocs;
