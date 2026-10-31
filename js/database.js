// js/database.js
import { app } from './auth.js';
import { 
    getFirestore, 
    collection, 
    addDoc, 
    getDocs,
    query,
    where,
    serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const db = getFirestore(app);

// ==========================================
// ESCRITA (CREATE)
// ==========================================

export const salvarCategoria = async (nome) => {
    const docRef = await addDoc(collection(db, "categorias"), {
        nome: nome,
        dataCriacao: serverTimestamp()
    });
    return docRef.id;
};

export const salvarSubcategoria = async (idCategoria, nome) => {
    const docRef = await addDoc(collection(db, "subcategorias"), {
        idCategoria: idCategoria,
        nome: nome,
        dataCriacao: serverTimestamp()
    });
    return docRef.id;
};

export const salvarFerramenta = async (dadosFerramenta) => {
    const docRef = await addDoc(collection(db, "ferramentas"), {
        ...dadosFerramenta,
        dataCadastro: serverTimestamp()
    });
    return docRef.id;
};

// ==========================================
// LEITURA (READ)
// ==========================================

export const getCategorias = async () => {
    const querySnapshot = await getDocs(collection(db, "categorias"));
    let categorias = [];
    querySnapshot.forEach((doc) => {
        categorias.push({ id: doc.id, ...doc.data() });
    });
    // Retorna ordenado por nome
    return categorias.sort((a, b) => a.nome.localeCompare(b.nome));
};

export const getSubcategorias = async (idCategoria) => {
    const q = query(collection(db, "subcategorias"), where("idCategoria", "==", idCategoria));
    const querySnapshot = await getDocs(q);
    let subcategorias = [];
    querySnapshot.forEach((doc) => {
        subcategorias.push({ id: doc.id, ...doc.data() });
    });
    return subcategorias.sort((a, b) => a.nome.localeCompare(b.nome));
};

export const getFerramentas = async () => {
    const querySnapshot = await getDocs(collection(db, "ferramentas"));
    let ferramentas = [];
    querySnapshot.forEach((doc) => {
        ferramentas.push({ id: doc.id, ...doc.data() });
    });
    // Retorna ordenado pela data de cadastro (mais recentes primeiro)
    return ferramentas.sort((a, b) => b.dataCadastro - a.dataCadastro);
};