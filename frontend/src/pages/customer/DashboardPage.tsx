import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useSavedCars, useDeleteSavedCar } from '@/hooks/useSavedCars';
import { Loader2, CarFront, Trash2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { AddVehicleModal } from '@/components/dashboard/AddVehicleModal';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: cars, isLoading } = useSavedCars();
  const deleteMutation = useDeleteSavedCar();

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to remove this vehicle?')) {
      deleteMutation.mutate(id, {
        onSuccess: () => toast.success('Vehicle removed')
      });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome, {user?.name}</h1>
          <p className="text-muted-foreground mt-1">
            Manage your vehicles to get personalized recommendations.
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Vehicle
        </button>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">My Garage</h2>

        {isLoading ? (
          <div className="flex justify-center py-12 border rounded-lg border-dashed">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : !cars || cars.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center rounded-lg border border-dashed border-border bg-card">
            <CarFront className="h-10 w-10 text-muted-foreground mb-4 opacity-50" />
            <h3 className="font-semibold text-lg">Your garage is empty</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              Add your vehicle to see parts and accessories that are guaranteed to fit.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cars.map((car: any) => (
              <div key={car.id} className="flex flex-col rounded-lg border border-border bg-card text-card-foreground shadow-sm p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    {car.nickname && (
                      <h3 className="font-semibold text-lg leading-none tracking-tight mb-1">
                        {car.nickname}
                      </h3>
                    )}
                    <p className={`text-sm text-muted-foreground ${!car.nickname && 'font-semibold text-foreground text-base'}`}>
                      {car.brand_name} {car.model_name}
                    </p>
                  </div>
                  <button 
                    onClick={() => handleDelete(car.id)}
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-destructive h-8 w-8"
                    title="Remove vehicle"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-auto pt-4 border-t border-border">
                  <span className="inline-flex items-center rounded-md border border-border px-2.5 py-0.5 text-xs font-semibold bg-muted/50 text-muted-foreground transition-colors">
                    {car.variant_name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && <AddVehicleModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};
