<?php

    
    $eixo   = $_GET['eixo'];
    
    $result;
    $json = array();

    switch($eixo){
        case 0:
            require_once('db/EixoUm.php');
            $result = EixoUm::getter_most_recent_year();
        case 1:
            require_once('db/EixoDois.php');
            foreach(EixoDois::getter_most_recent_year() as $result){
                if(!isset($json[$result->Numero]))
                    $json[$result->Numero] = array();
                    
                $json[$result->Numero][$result->idOcupacao] = $result->Ano;
            }
        case 2:
            require_once('db/EixoTres.php');
            $result = EixoTres::getter_most_recent_year();
        case 3:
            require_once('db/EixoQuatro.php');
            $result = EixoQuatro::getter_most_recent_year();
    }

    echo json_encode($json);


    