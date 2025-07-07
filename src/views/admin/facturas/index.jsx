import React, { useState, useEffect } from "react";
import Card from "components/card";
import { MdAdd, MdEdit, MdDelete, MdDownload, MdVisibility, MdSearch } from "react-icons/md";
import Modal from "components/modal";
import EditFacturaModal from "components/modal/EditFacturaModal";
import { useAuth } from "context/AuthContext";
import { facturasService } from "services/facturasService";

const Facturas = () => {
  const { user } = useAuth();
  const [facturas, setFacturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedFactura, setSelectedFactura] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFacturas, setFilteredFacturas] = useState([]);
  const [statusFilter, setStatusFilter] = useState("todos");

  useEffect(() => {
    fetchFacturas();
  }, []);

  useEffect(() => {
    let filtered = facturas;

    // Filtro por estado
    if (statusFilter !== "todos") {
      filtered = filtered.filter((factura) => factura.status === statusFilter);
    }

    // Filtro por búsqueda
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter((factura) => {
        const searchLower = searchTerm.toLowerCase();
        return (
          factura.invoice_number?.toLowerCase().includes(searchLower) ||
          factura.Supplier?.name?.toLowerCase().includes(searchLower) ||
          factura.Project?.name?.toLowerCase().includes(searchLower)
        );
      });
    }

    setFilteredFacturas(filtered);
  }, [searchTerm, statusFilter, facturas]);

  const fetchFacturas = async () => {
    try {
      setLoading(true);
      const data = await facturasService.getFacturas();
      setFacturas(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateFactura = async (facturaId, updateData) => {
    try {
      await facturasService.updateFactura(facturaId, updateData);
      // Recargar las facturas después de la actualización
      await fetchFacturas();
      // Mostrar mensaje de éxito
      alert('Factura actualizada correctamente');
    } catch (error) {
      console.error('Error al actualizar factura:', error);
      throw error;
    }
  };

  const handleDeleteFactura = async (facturaId) => {
    try {
      await facturasService.deleteFactura(facturaId);
      // Recargar las facturas después de la eliminación
      await fetchFacturas();
      setIsDeleteModalOpen(false);
      // Mostrar mensaje de éxito
      alert('Factura eliminada correctamente');
    } catch (error) {
      console.error('Error al eliminar factura:', error);
      alert('Error al eliminar la factura: ' + error.message);
    }
  };

  const handleCreate = () => {
    setIsCreateModalOpen(true);
  };

  const handleEdit = (factura) => {
    setSelectedFactura(factura);
    setIsEditModalOpen(true);
  };

  const handleDelete = (factura) => {
    setSelectedFactura(factura);
    setIsDeleteModalOpen(true);
  };

  const handleView = (factura) => {
    setSelectedFactura(factura);
    setIsViewModalOpen(true);
  };

  const handleDownload = (factura) => {
    // Aquí irá la lógica para descargar la factura en PDF
    console.log("Descargando factura:", factura);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-CO');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pagado':
        return 'bg-green-100 text-green-800';
      case 'Pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'Cancelado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Cargando facturas...</div>
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
    <div className="mt-3">
      <div className="col-span-1 h-fit w-full">
        <Card extra={"w-full h-full px-8 pb-8 sm:overflow-x-auto"}>
          <div className="flex items-center justify-between py-4">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              Facturas
            </h1>
          </div>

          {/* Filtros */}
          <div className="mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Barra de búsqueda */}
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MdSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar por número de factura, proveedor o proyecto..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Filtro por estado */}
              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="block w-48 px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="todos">Todos los estados</option>
                  <option value="Pagado">Pagado</option>
                  <option value="Pendiente">Pendiente</option>
                  <option value="Cancelado">Cancelado</option>
                </select>
              </div>
            </div>

            {/* Contador de resultados */}
            {(searchTerm || statusFilter !== "todos") && (
              <div className="mt-2 text-sm text-gray-600">
                {filteredFacturas.length} resultado{filteredFacturas.length !== 1 ? 's' : ''} encontrado{filteredFacturas.length !== 1 ? 's' : ''}
                {searchTerm && <span> para "{searchTerm}"</span>}
                {statusFilter !== "todos" && <span> en estado "{statusFilter}"</span>}
              </div>
            )}
          </div>

          {/* Tabla de facturas */}
              <div className="mt-4 overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">Número</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">Proveedor</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">Fecha</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">Método de Pago</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">Monto Total</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">Estado</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">Proyecto</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFacturas.map((factura) => (
                      <tr key={factura.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-800 font-medium">{factura.invoice_number}</td>
                        <td className="px-4 py-3 text-sm text-gray-800">{factura.Supplier?.name || 'N/A'}</td>
                        <td className="px-4 py-3 text-sm text-gray-800">{formatDate(factura.date)}</td>
                        <td className="px-4 py-3 text-sm text-gray-800">{factura.payment_method}</td>
                        <td className="px-4 py-3 text-sm text-gray-800 font-medium">{formatCurrency(factura.total_amount)}</td>
                        <td className="px-4 py-3 text-sm text-gray-800">
                          <span className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(factura.status)}`}>
                            {factura.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-800">{factura.Project?.name || 'N/A'}</td>
                        <td className="px-4 py-3 text-sm text-gray-800">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleView(factura)}
                              className="text-blue-600 hover:text-blue-700"
                              title="Ver detalles"
                            >
                              <MdVisibility className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleEdit(factura)}
                              className="text-orange-600 hover:text-orange-700"
                              title="Editar"
                            >
                              <MdEdit className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(factura)}
                              className="text-red-600 hover:text-red-700"
                              title="Eliminar"
                            >
                              <MdDelete className="h-5 w-5" />
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
        title={`Detalles de Factura - ${selectedFactura?.invoice_number}`}
      >
        <div className="p-6 space-y-6">
          {selectedFactura && (
            <>
              {/* Información Principal */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Información de la Factura</h3>
                  <div className="space-y-2">
                    <div><span className="font-medium">Número:</span> {selectedFactura.invoice_number}</div>
                    <div><span className="font-medium">Fecha:</span> {formatDate(selectedFactura.date)}</div>
                    <div><span className="font-medium">Monto Total:</span> {formatCurrency(selectedFactura.total_amount)}</div>
                    <div><span className="font-medium">Método de Pago:</span> {selectedFactura.payment_method}</div>
                    <div><span className="font-medium">Estado:</span> 
                      <span className={`ml-2 rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(selectedFactura.status)}`}>
                        {selectedFactura.status}
                      </span>
                    </div>
                    <div><span className="font-medium">Descripción:</span> {selectedFactura.description}</div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Información del Proveedor</h3>
                  <div className="space-y-2">
                    <div><span className="font-medium">Nombre:</span> {selectedFactura.Supplier?.name}</div>
                    <div><span className="font-medium">NIT:</span> {selectedFactura.Supplier?.tax_id}</div>
                    <div><span className="font-medium">Dirección:</span> {selectedFactura.Supplier?.address}</div>
                    <div><span className="font-medium">Teléfono:</span> {selectedFactura.Supplier?.phone}</div>
                    <div><span className="font-medium">Email:</span> {selectedFactura.Supplier?.email}</div>
                    <div><span className="font-medium">Contacto:</span> {selectedFactura.Supplier?.contact_name}</div>
                  </div>
                </div>
              </div>

              {/* Información del Proyecto y Centro de Costos */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Información del Proyecto</h3>
                  <div className="space-y-2">
                    <div><span className="font-medium">Código:</span> {selectedFactura.Project?.code}</div>
                    <div><span className="font-medium">Nombre:</span> {selectedFactura.Project?.name}</div>
                    <div><span className="font-medium">Descripción:</span> {selectedFactura.Project?.description}</div>
                    <div><span className="font-medium">Estado:</span> {selectedFactura.Project?.status}</div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Centro de Costos</h3>
                  <div className="space-y-2">
                    <div><span className="font-medium">Código:</span> {selectedFactura.CostCenter?.code}</div>
                    <div><span className="font-medium">Nombre:</span> {selectedFactura.CostCenter?.name}</div>
                    <div><span className="font-medium">Descripción:</span> {selectedFactura.CostCenter?.description}</div>
                    <div><span className="font-medium">Estado:</span> {selectedFactura.CostCenter?.status}</div>
                  </div>
                </div>
              </div>

              {/* Información del Usuario */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Usuario Responsable</h3>
                <div className="space-y-2">
                  <div><span className="font-medium">Usuario:</span> {selectedFactura.User?.username}</div>
                  <div><span className="font-medium">Rol:</span> {selectedFactura.User?.role}</div>
                </div>
              </div>

              {/* Fechas de Creación y Actualización */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Fechas</h3>
                  <div className="space-y-2">
                    <div><span className="font-medium">Creado:</span> {formatDate(selectedFactura.created_at)}</div>
                    <div><span className="font-medium">Actualizado:</span> {formatDate(selectedFactura.updated_at)}</div>
                  </div>
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
        title="Nueva Factura"
      >
        <div className="p-4">
          <p className="text-gray-600">Funcionalidad de creación en desarrollo...</p>
        </div>
      </Modal>

      {/* Modal de Edición */}
      <EditFacturaModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        factura={selectedFactura}
        onUpdate={handleUpdateFactura}
      />

      {/* Modal de Eliminación */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Eliminar Factura"
      >
        <div className="p-4">
          <p className="text-gray-600">
            ¿Está seguro que desea eliminar la factura {selectedFactura?.invoice_number}?
          </p>
          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="rounded-lg border border-gray-300 px-4 py-2 text-gray-800"
            >
              Cancelar
            </button>
            <button
              onClick={() => handleDeleteFactura(selectedFactura.id)}
              className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
            >
              Eliminar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Facturas; 