<?php

namespace App\Exceptions;

use Exception;

class VehiculeNotAvailableException extends Exception
{
    protected $vehicule;

    public function __construct($vehiculeOrMessage, $message = null)
    {
        // Si c'est une chaîne, c'est le message directement
        if (is_string($vehiculeOrMessage)) {
            parent::__construct($vehiculeOrMessage);
            return;
        }
        
        // Sinon c'est un objet véhicule
        $this->vehicule = $vehiculeOrMessage;
        
        if (!$message) {
            $message = "Le véhicule {$vehiculeOrMessage->numero_parc} n'est pas disponible";
        }
        
        parent::__construct($message);
    }

    public function getVehicule()
    {
        return $this->vehicule;
    }
}