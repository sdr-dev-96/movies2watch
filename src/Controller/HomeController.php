<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use App\Form\Type\UserType;

class HomeController extends AbstractController
{
    /**
     * @Route("/", name="home")
     */
    public function index()
    {
        return $this->render('home/index.html.twig', [
            'title' =>  "Movies2Watch",
            'page'  =>  'home'
        ]);
    }

    /**
     * @Route("/profil", name="profil")
     */
    public function profil()
    {
        $this->denyAccessUnlessGranted('ROLE_USER');
        $user = $this->getUser();    
        $form = $this->createForm(UserType::class, $user);        
        return $this->render('home/profil.html.twig', [
            'form'  =>  $form
        ]);
    }
}
