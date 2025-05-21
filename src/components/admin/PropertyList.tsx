
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Property, propertyStatuses } from "@/types/property";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, MoreHorizontal, Archive, Home, Loader2 } from "lucide-react";

interface PropertyListProps {
  properties: Property[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onChangeStatus: (id: string, status: 'active' | 'sold' | 'archived') => void;
  loading?: boolean;
  error?: string | null;
}

export default function PropertyList({ properties, onEdit, onDelete, onChangeStatus, loading, error }: PropertyListProps) {
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [filter, setFilter] = useState<string | null>(null);
  
  const filteredProperties = filter 
    ? properties.filter(property => property.status === filter) 
    : properties;
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const getStatusColor = (status: string) => {
    return propertyStatuses.find(s => s.value === status)?.color || "";
  };
  
  // If there's an error, display it
  if (error) {
    return (
      <Card className="border-destructive">
        <CardContent className="p-6">
          <div className="text-center text-destructive">
            <p className="text-lg font-medium">Fehler beim Laden der Immobilien</p>
            <p className="mt-1">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // If loading, display a loading state
  if (loading) {
    return (
      <Card>
        <CardContent className="flex justify-center items-center p-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="mt-4 text-muted-foreground">Immobilien werden geladen...</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <Button
            variant={filter === null ? "secondary" : "outline"}
            size="sm"
            onClick={() => setFilter(null)}
          >
            Alle
          </Button>
          <Button
            variant={filter === 'active' ? "secondary" : "outline"}
            size="sm"
            onClick={() => setFilter('active')}
          >
            Aktiv
          </Button>
          <Button
            variant={filter === 'sold' ? "secondary" : "outline"}
            size="sm"
            onClick={() => setFilter('sold')}
          >
            Verkauft
          </Button>
          <Button
            variant={filter === 'archived' ? "secondary" : "outline"}
            size="sm"
            onClick={() => setFilter('archived')}
          >
            Archiviert
          </Button>
        </div>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Titel</TableHead>
                <TableHead>Adresse</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Preis</TableHead>
                <TableHead>Erstellt am</TableHead>
                <TableHead className="w-[80px] text-right">Aktionen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProperties.length > 0 ? (
                filteredProperties.map((property) => (
                  <TableRow key={property.id}>
                    <TableCell className="font-medium">
                      {property.title}
                    </TableCell>
                    <TableCell>{property.address}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(property.status)}>
                        {propertyStatuses.find(s => s.value === property.status)?.label || property.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{property.details.price ? `${property.details.price} €` : "Auf Anfrage"}</TableCell>
                    <TableCell>{formatDate(property.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onEdit(property.id)}>
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Bearbeiten</span>
                          </DropdownMenuItem>
                          {property.status !== "active" && (
                            <DropdownMenuItem onClick={() => onChangeStatus(property.id, 'active')}>
                              <Home className="mr-2 h-4 w-4" />
                              <span>Als aktiv markieren</span>
                            </DropdownMenuItem>
                          )}
                          {property.status !== "sold" && (
                            <DropdownMenuItem onClick={() => onChangeStatus(property.id, 'sold')}>
                              <Home className="mr-2 h-4 w-4" />
                              <span>Als verkauft markieren</span>
                            </DropdownMenuItem>
                          )}
                          {property.status !== "archived" && (
                            <DropdownMenuItem onClick={() => onChangeStatus(property.id, 'archived')}>
                              <Archive className="mr-2 h-4 w-4" />
                              <span>Archivieren</span>
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem 
                            className="text-destructive focus:text-destructive"
                            onClick={() => setDeleteConfirm(property.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Löschen</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                    {filter 
                      ? `Keine ${filter === 'active' ? 'aktiven' : filter === 'sold' ? 'verkauften' : 'archivierten'} Immobilien gefunden.` 
                      : "Keine Immobilien vorhanden."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Immobilie löschen</DialogTitle>
            <DialogDescription>
              Sind Sie sicher, dass Sie diese Immobilie löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Abbrechen</Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                if (deleteConfirm) {
                  onDelete(deleteConfirm);
                  setDeleteConfirm(null);
                }
              }}
            >
              Löschen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
