<?php

namespace App\Exceptions;

use Exception;

class VehiculeNotAvailableException extends Exception
{
    protected $vehicule;

    public function __construct($vehicule, $message = null)
    {
        $this->vehicule = $vehicule;
        
        if (!$message) {
            $message = "Le véhicule {$vehicule->numero_parc} n'est pas disponible";
        }
        
        parent::__construct($message);
    }

    public function getVehicule()
    {
        return $this->vehicule;
    }
}