import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Lock, Eye, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Confidentialite() {
  return (
    <div className="min-h-screen bg-deep-dark text-foreground selection:bg-primary selection:text-primary-foreground">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,#0a0a0a,#030307)] pointer-events-none" />
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/5 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 md:px-6 h-14 md:h-16 flex items-center">
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              Retour
            </Button>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="relative z-10 container mx-auto px-4 md:px-6 py-12 md:py-20 max-w-3xl">
        <h1 className="font-sans text-3xl md:text-4xl font-bold mb-2 text-foreground">
          Politique de Confidentialité
        </h1>
        <p className="text-white/50 mb-8">Conforme au RGPD • Dernière mise à jour : Décembre 2024</p>

        {/* Trust Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
          {[
            { icon: Shield, label: "Conforme RGPD" },
            { icon: Lock, label: "Données Cryptées" },
            { icon: Eye, label: "Transparence" },
            { icon: UserCheck, label: "Vos Droits" },
          ].map((badge, i) => (
            <div key={i} className="flex flex-col items-center gap-2 p-4 bg-white/5 rounded-xl border border-white/10">
              <badge.icon className="h-5 w-5 text-primary" />
              <span className="text-xs text-white/60 text-center">{badge.label}</span>
            </div>
          ))}
        </div>

        <div className="space-y-10 text-white/70 leading-relaxed">
          {/* Responsable */}
          <section>
            <h2 className="font-sans text-xl md:text-2xl font-semibold mb-4 text-foreground">
              1. Responsable du traitement
            </h2>
            <div className="bg-white/5 rounded-xl p-5 border border-white/10">
              <p><span className="text-white/90 font-medium">Responsable :</span> [Nom de la société]</p>
              <p><span className="text-white/90 font-medium">Adresse :</span> [Adresse du siège]</p>
              <p><span className="text-white/90 font-medium">Email DPO :</span> contact@nivo-axis.com</p>
            </div>
          </section>

          {/* Données collectées */}
          <section>
            <h2 className="font-sans text-xl md:text-2xl font-semibold mb-4 text-foreground">
              2. Données collectées
            </h2>
            <p className="mb-4">
              Dans le cadre de nos services, nous collectons les données suivantes :
            </p>
            <div className="space-y-3">
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <p className="text-white/90 font-medium mb-1">Données d'identification</p>
                <p className="text-sm">Nom, prénom, adresse email</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <p className="text-white/90 font-medium mb-1">Données de diagnostic</p>
                <p className="text-sm">Réponses au questionnaire de santé et bien-être (score de santé, objectifs)</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <p className="text-white/90 font-medium mb-1">Données de paiement</p>
                <p className="text-sm">Traitées exclusivement par Stripe (nous ne stockons pas vos données bancaires)</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <p className="text-white/90 font-medium mb-1">Données d'utilisation</p>
                <p className="text-sm">Progression dans les programmes, historique des sessions</p>
              </div>
            </div>
          </section>

          {/* Finalités */}
          <section>
            <h2 className="font-sans text-xl md:text-2xl font-semibold mb-4 text-foreground">
              3. Finalités du traitement
            </h2>
            <p>Vos données sont collectées pour les finalités suivantes :</p>
            <ul className="list-disc list-inside mt-3 space-y-2 ml-2">
              <li><strong className="text-white/90">Fourniture du service :</strong> Personnalisation de votre programme, suivi de progression</li>
              <li><strong className="text-white/90">Gestion du compte :</strong> Création et gestion de votre espace membre</li>
              <li><strong className="text-white/90">Paiement :</strong> Traitement sécurisé de vos transactions via Stripe</li>
              <li><strong className="text-white/90">Communication :</strong> Envoi d'emails relatifs à votre programme (rappels, mises à jour)</li>
              <li><strong className="text-white/90">Amélioration :</strong> Analyse anonymisée pour améliorer nos services</li>
            </ul>
          </section>

          {/* Base légale */}
          <section>
            <h2 className="font-sans text-xl md:text-2xl font-semibold mb-4 text-foreground">
              4. Base légale
            </h2>
            <p>Le traitement de vos données repose sur :</p>
            <ul className="list-disc list-inside mt-3 space-y-1 ml-2">
              <li>L'exécution du contrat (fourniture des programmes)</li>
              <li>Votre consentement explicite (questionnaire diagnostic)</li>
              <li>Nos intérêts légitimes (amélioration des services, sécurité)</li>
              <li>Le respect de nos obligations légales</li>
            </ul>
          </section>

          {/* Sécurité */}
          <section>
            <h2 className="font-sans text-xl md:text-2xl font-semibold mb-4 text-foreground">
              5. Sécurité des données
            </h2>
            <div className="bg-primary/10 border border-primary/30 rounded-xl p-5">
              <p className="text-white/90 font-medium mb-3 flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Protection renforcée
              </p>
              <p>
                Vos données sont hébergées de manière sécurisée sur <strong className="text-white/90">Supabase</strong>, 
                une infrastructure conforme aux standards de sécurité les plus stricts :
              </p>
              <ul className="list-disc list-inside mt-3 space-y-1 ml-2">
                <li>Chiffrement des données en transit (TLS) et au repos</li>
                <li>Authentification sécurisée</li>
                <li>Sauvegardes automatiques</li>
                <li>Accès restreint aux données personnelles</li>
              </ul>
            </div>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="font-sans text-xl md:text-2xl font-semibold mb-4 text-foreground">
              6. Cookies
            </h2>
            <p>Notre site utilise des cookies pour :</p>
            <div className="mt-4 space-y-3">
              <div className="flex items-start gap-3 bg-white/5 rounded-xl p-4 border border-white/10">
                <span className="text-primary font-bold">1</span>
                <div>
                  <p className="text-white/90 font-medium">Cookies essentiels</p>
                  <p className="text-sm">Nécessaires au fonctionnement du site (session, authentification)</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-white/5 rounded-xl p-4 border border-white/10">
                <span className="text-primary font-bold">2</span>
                <div>
                  <p className="text-white/90 font-medium">Cookies analytiques</p>
                  <p className="text-sm">Mesure d'audience anonymisée pour améliorer l'expérience utilisateur</p>
                </div>
              </div>
            </div>
            <p className="mt-4 text-sm">
              Vous pouvez gérer vos préférences de cookies via les paramètres de votre navigateur.
            </p>
          </section>

          {/* Durée de conservation */}
          <section>
            <h2 className="font-sans text-xl md:text-2xl font-semibold mb-4 text-foreground">
              7. Durée de conservation
            </h2>
            <p>Vos données sont conservées pour la durée suivante :</p>
            <ul className="list-disc list-inside mt-3 space-y-1 ml-2">
              <li><strong className="text-white/90">Données de compte :</strong> Durée de vie du compte + 3 ans après suppression</li>
              <li><strong className="text-white/90">Données de transaction :</strong> 10 ans (obligations comptables)</li>
              <li><strong className="text-white/90">Cookies :</strong> 13 mois maximum</li>
            </ul>
          </section>

          {/* Droits des utilisateurs */}
          <section>
            <h2 className="font-sans text-xl md:text-2xl font-semibold mb-4 text-foreground">
              8. Vos droits
            </h2>
            <p className="mb-4">
              Conformément au RGPD, vous disposez des droits suivants :
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { title: "Droit d'accès", desc: "Obtenir une copie de vos données" },
                { title: "Droit de rectification", desc: "Corriger vos informations" },
                { title: "Droit à l'effacement", desc: "Supprimer vos données" },
                { title: "Droit à la portabilité", desc: "Récupérer vos données" },
                { title: "Droit d'opposition", desc: "Vous opposer au traitement" },
                { title: "Droit à la limitation", desc: "Limiter l'utilisation" },
              ].map((right, i) => (
                <div key={i} className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <p className="text-white/90 font-medium">{right.title}</p>
                  <p className="text-sm">{right.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 bg-white/5 rounded-xl p-5 border border-white/10">
              <p className="text-white/90 font-medium mb-2">Pour exercer vos droits :</p>
              <p>
                Envoyez un email à <a href="mailto:contact@nivo-axis.com" className="text-primary hover:underline">contact@nivo-axis.com</a> 
                {" "}avec une copie de votre pièce d'identité. Nous vous répondrons sous 30 jours.
              </p>
            </div>
          </section>

          {/* Réclamation */}
          <section>
            <h2 className="font-sans text-xl md:text-2xl font-semibold mb-4 text-foreground">
              9. Réclamation
            </h2>
            <p>
              Si vous estimez que le traitement de vos données ne respecte pas la réglementation, vous pouvez 
              introduire une réclamation auprès de la <strong className="text-white/90">CNIL</strong> (Commission Nationale 
              de l'Informatique et des Libertés) : <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">www.cnil.fr</a>
            </p>
          </section>

          {/* Modifications */}
          <section>
            <h2 className="font-sans text-xl md:text-2xl font-semibold mb-4 text-foreground">
              10. Modifications
            </h2>
            <p>
              Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment. 
              Les modifications prennent effet dès leur publication sur cette page. Nous vous encourageons 
              à consulter régulièrement cette page.
            </p>
          </section>
        </div>

        {/* Footer Links */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-wrap gap-4 text-sm text-white/40">
          <Link to="/mentions-legales" className="hover:text-white/70 transition-colors">Mentions Légales</Link>
          <span>•</span>
          <Link to="/cgv" className="hover:text-white/70 transition-colors">CGV</Link>
        </div>
      </main>
    </div>
  );
}
