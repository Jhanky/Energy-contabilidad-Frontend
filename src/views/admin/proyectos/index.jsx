import React, { useState, useEffect } from "react";
import Card from "components/card";
import { MdAdd, MdEdit, MdDelete, MdVisibility } from "react-icons/md";
import Modal from "components/modal";
import { useAuth } from "context/AuthContext";

const Proyectos = () => {
  const { user } = useAuth();
  const [proyectos, setProyectos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedProyecto, setSelectedProyecto] = useState(null);
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
    status: "activo"
  });
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  useEffect(() => {
    fetchProyectos();
  }, []);

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 3000);
  };

  const fetchProyectos = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/projects", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${user.token}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error("Error al cargar los proyectos");
      }

      const data = await response.json();
      setProyectos(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setFormData({
      code: "",
      name: "",
      description: "",
      status: "activo"
    });
    setFormError("");
    setIsEditMode(false);
    setIsCreateModalOpen(true);
  };

  const handleEdit = (proyecto) => {
    setSelectedProyecto(proyecto);
    setFormData({
      code: proyecto.code || "",
      name: proyecto.name || "",
      description: proyecto.description || "",
      status: proyecto.status || "activo"
    });
    setFormError("");
    setIsEditMode(true);
    setIsEditModalOpen(true);
  };

  const handleDelete = (proyecto) => {
    setSelectedProyecto(proyecto);
    setIsDeleteModalOpen(true);
  };

  const handleView = (proyecto) => {
    setSelectedProyecto(proyecto);
    setIsViewModalOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormLoading(true);

    try {
      // Validaciones básicas
      if (!formData.code || !formData.name) {
        throw new Error("Por favor complete los campos obligatorios: Código y Nombre del Proyecto");
      }

      const url = isEditMode 
        ? `http://localhost:3000/projects/${selectedProyecto.id}`
        : "http://localhost:3000/projects";
      
      const method = isEditMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Authorization": `Bearer ${user.token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error al ${isEditMode ? 'actualizar' : 'crear'} el proyecto`);
      }

      // Mostrar mensaje de éxito
      const successMessage = isEditMode 
        ? `Proyecto "${formData.name}" actualizado exitosamente`
        : `Proyecto "${formData.name}" creado exitosamente`;
      showNotification(successMessage, "success");

      // Cerrar modal y recargar lista
      if (isEditMode) {
        setIsEditModalOpen(false);
      } else {
        setIsCreateModalOpen(false);
      }
      setSelectedProyecto(null);
      setIsEditMode(false);
      fetchProyectos();
    } catch (error) {
      setFormError(error.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      setFormLoading(true);
      const response = await fetch(`http://localhost:3000/projects/${selectedProyecto.id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${user.token}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al eliminar el proyecto");
      }

      // Mostrar mensaje de éxito
      showNotification(`Proyecto "${selectedProyecto.name}" eliminado exitosamente`, "success");

      // Cerrar modal y recargar lista
      setIsDeleteModalOpen(false);
      setSelectedProyecto(null);
      fetchProyectos();
    } catch (error) {
      setFormError(error.message);
      // Mantener el modal abierto para mostrar el error
    } finally {
      setFormLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-CO');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'activo':
        return 'bg-green-100 text-green-800';
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'completado':
        return 'bg-blue-100 text-blue-800';
      case 'cancelado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Cargando proyectos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="mt-3 grid h-full grid-cols-1 gap-5 xl:grid-cols-2 2xl:grid-cols-3">
      {/* Notificación */}
      {notification.show && (
        <div className="fixed top-4 right-4 z-50">
          <div className={`rounded-lg p-4 shadow-lg ${
            notification.type === "success" 
              ? "bg-green-100 border border-green-400 text-green-700" 
              : "bg-red-100 border border-red-400 text-red-700"
          }`}>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {notification.type === "success" ? (
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{notification.message}</p>
              </div>
              <div className="ml-auto pl-3">
                <button
                  onClick={() => setNotification({ show: false, message: "", type: "" })}
                  className="inline-flex text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="col-span-1 h-fit w-full xl:col-span-2 2xl:col-span-3">
        <Card extra={"w-full h-full px-8 pb-8 sm:overflow-x-auto"}>
          <div className="flex items-center justify-between py-4">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              Proyectos
            </h1>
          </div>

          {/* Tabla de proyectos */}
          <div className="mt-4 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">Código</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">Nombre</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">Descripción</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">Estado</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">Fecha Creación</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {proyectos.map((proyecto) => (
                  <tr key={proyecto.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-800 font-medium">{proyecto.code}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">{proyecto.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">{proyecto.description}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">
                      <span className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(proyecto.status)}`}>
                        {proyecto.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-800">{formatDate(proyecto.created_at)}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">
                      <div className="flex justify-center">
                        <button
                          onClick={() => handleView(proyecto)}
                          className="text-blue-600 hover:text-blue-700"
                          title="Ver detalles"
                        >
                          <MdVisibility className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Modal de Vista Detallada */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title={`Detalles del Proyecto - ${selectedProyecto?.name}`}
      >
        <div className="p-6 space-y-6">
          {selectedProyecto && (
            <>
              {/* Información Principal */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Información del Proyecto</h3>
                  <div className="space-y-2">
                    <div><span className="font-medium">Código:</span> {selectedProyecto.code}</div>
                    <div><span className="font-medium">Nombre:</span> {selectedProyecto.name}</div>
                    <div><span className="font-medium">Estado:</span> 
                      <span className={`ml-2 rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(selectedProyecto.status)}`}>
                        {selectedProyecto.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Descripción</h3>
                  <div className="space-y-2">
                    <div><span className="font-medium">Descripción:</span> {selectedProyecto.description}</div>
                  </div>
                </div>
              </div>

              {/* Fechas de Creación y Actualización */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Fechas</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div><span className="font-medium">Creado:</span> {formatDate(selectedProyecto.created_at)}</div>
                  <div><span className="font-medium">Actualizado:</span> {formatDate(selectedProyecto.updated_at)}</div>
                </div>
              </div>
            </>
          )}
        </div>
      </Modal>

      {/* Modal de Creación */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Nuevo Proyecto"
      >
        <div className="p-6">
          <form onSubmit={handleFormSubmit} className="space-y-4">
            {formError && (
              <div className="rounded-lg bg-red-100 p-4 text-red-700">
                {formError}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Código del Proyecto *
                </label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleFormChange}
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="PROJ001"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nombre del Proyecto *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Ingrese el nombre del proyecto"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Descripción
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                rows="3"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Ingrese la descripción del proyecto"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Estado
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleFormChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="activo">Activo</option>
                <option value="pendiente">Pendiente</option>
                <option value="completado">Completado</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                disabled={formLoading}
                className="rounded-lg border border-gray-300 px-4 py-2 text-gray-800 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={formLoading}
                className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-50"
              >
                {formLoading ? "Guardando..." : "Guardar Proyecto"}
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Modal de Edición */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedProyecto(null);
          setIsEditMode(false);
          setFormError("");
        }}
        title="Editar Proyecto"
      >
        <div className="p-6">
          <form onSubmit={handleFormSubmit} className="space-y-4">
            {formError && (
              <div className="rounded-lg bg-red-100 p-4 text-red-700">
                {formError}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Código del Proyecto *
                </label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleFormChange}
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="PROJ001"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nombre del Proyecto *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Ingrese el nombre del proyecto"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Descripción
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                rows="3"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Ingrese la descripción del proyecto"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Estado
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleFormChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="activo">Activo</option>
                <option value="pendiente">Pendiente</option>
                <option value="completado">Completado</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <button
                type="button"
                onClick={() => {
                  setIsEditModalOpen(false);
                  setSelectedProyecto(null);
                  setIsEditMode(false);
                  setFormError("");
                }}
                disabled={formLoading}
                className="rounded-lg border border-gray-300 px-4 py-2 text-gray-800 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={formLoading}
                className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {formLoading ? "Actualizando..." : "Actualizar Proyecto"}
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Modal de Eliminación */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Eliminar Proyecto"
      >
        <div className="p-6">
          {formError && (
            <div className="mb-4 rounded-lg bg-red-100 p-4 text-red-700">
              {formError}
            </div>
          )}
          
          <p className="text-gray-600 mb-4">
            ¿Está seguro que desea eliminar el proyecto <strong>{selectedProyecto?.name}</strong>?
          </p>
          
          <p className="text-sm text-gray-500 mb-6">
            <strong>Nota:</strong> Esta acción no se puede deshacer.
          </p>
          
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setIsDeleteModalOpen(false);
                setFormError("");
                setSelectedProyecto(null);
              }}
              disabled={formLoading}
              className="rounded-lg border border-gray-300 px-4 py-2 text-gray-800 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleDeleteConfirm}
              disabled={formLoading}
              className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-50"
            >
              {formLoading ? "Eliminando..." : "Eliminar Proyecto"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Proyectos; 