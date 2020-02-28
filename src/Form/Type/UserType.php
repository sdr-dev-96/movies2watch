<?php

namespace App\Form\Type;

use App\Entity\User;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\DateType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\RepeatedType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\FormBuilderInterface;

class UserType extends AbstractType
{
    // ...

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => User::class,
        ]);
    }

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('nom', TextType::class, array(
                'label'=>'Nom *',
                'attr' => array(
                    'class' => 'form-control',
                )
            ))
            ->add('prenom', TextType::class, array(
                'label'=>'Prenom *',
                'attr' => array(
                    'class' => 'form-control'
                )
            ))
            ->add('username', TextType::class, array(
                'label'=>'Identifiant *',
                'attr' => array(
                    'class' => 'form-control'
                )
            ))
            ->add('email', EmailType::class, array(
                'label'=>'Email *',
                'attr' => array(
                    'class' => 'form-control'
                )
            ))
            ->add('plainPassword', RepeatedType::class, array(
                'type' => PasswordType::class,
                'first_options'  => array(
                    'label' => 'Mot de passe *',
                    'attr' => array(
                        'class' => 'form-control'
                    )
                ),
                'second_options' => array(
                    'label' => 'Répéter mot de passe *',
                    'attr' => array(
                        'class' => 'form-control'
                    )
                ),
            ))
            ->add('naissance', DateType::class, array(
                'label'=>'Date de naissance *',
                'attr' => array(
                    'class' => '',
                ),
                'widget' => 'single_text',
            ))
            ->add('Enregistrer', SubmitType::class)
        ;
    }
}