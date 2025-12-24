import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CGV() {
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
          Conditions Générales de Vente
        </h1>
        <p className="text-white/50 mb-8">Dernière mise à jour : Décembre 2024</p>

        <div className="space-y-10 text-white/70 leading-relaxed">
          {/* Objet */}
          <section>
            <h2 className="font-sans text-xl md:text-2xl font-semibold mb-4 text-foreground">
              1. Objet
            </h2>
            <p>
              Les présentes Conditions Générales de Vente (CGV) régissent la vente de programmes digitaux de santé 
              et de bien-être proposés par NIVO via le site nivo-axis.com. Toute commande implique l'acceptation 
              sans réserve des présentes CGV.
            </p>
          </section>

          {/* Produits */}
          <section>
            <h2 className="font-sans text-xl md:text-2xl font-semibold mb-4 text-foreground">
              2. Description des produits
            </h2>
            <p>
              NIVO propose des programmes numériques d'accompagnement postural et de bien-être physique. 
              Ces programmes comprennent :
            </p>
            <ul className="list-disc list-inside mt-3 space-y-1 ml-2">
              <li>Des exercices guidés en format vidéo et audio</li>
              <li>Des protocoles personnalisés basés sur un diagnostic initial</li>
              <li>Un accès à un espace membre en ligne</li>
              <li>Un suivi de progression</li>
            </ul>
          </section>

          {/* Prix */}
          <section>
            <h2 className="font-sans text-xl md:text-2xl font-semibold mb-4 text-foreground">
              3. Prix
            </h2>
            <p>
              Les prix affichés sur le site sont indiqués en <strong className="text-white/90">Euros (€)</strong> et 
              sont <strong className="text-white/90">Toutes Taxes Comprises (TTC)</strong>. NIVO se réserve le droit 
              de modifier ses prix à tout moment, étant entendu que le prix applicable est celui affiché au moment 
              de la validation de la commande.
            </p>
          </section>

          {/* Paiement */}
          <section>
            <h2 className="font-sans text-xl md:text-2xl font-semibold mb-4 text-foreground">
              4. Paiement
            </h2>
            <p>
              Le paiement s'effectue en ligne par carte bancaire via notre prestataire sécurisé Stripe. 
              Le paiement est dû intégralement au moment de la commande. La transaction est sécurisée 
              et vos données bancaires ne sont jamais stockées sur nos serveurs.
            </p>
          </section>

          {/* Accès */}
          <section>
            <h2 className="font-sans text-xl md:text-2xl font-semibold mb-4 text-foreground">
              5. Livraison numérique
            </h2>
            <div className="bg-white/5 rounded-xl p-5 border border-white/10">
              <p>
                La livraison est <strong className="text-white/90">100% numérique et immédiate</strong>. 
                Dès validation du paiement, vous recevez un email de confirmation avec vos identifiants 
                d'accès à l'espace membre. L'accès au contenu est disponible instantanément.
              </p>
            </div>
          </section>

          {/* Rétractation */}
          <section>
            <h2 className="font-sans text-xl md:text-2xl font-semibold mb-4 text-foreground">
              6. Droit de rétractation
            </h2>
            <div className="bg-primary/10 border border-primary/30 rounded-xl p-5">
              <p className="text-white/90 font-medium mb-3">
                ⚠️ Clause importante relative aux produits numériques
              </p>
              <p>
                Conformément à l'article L221-28 du Code de la consommation, le droit de rétractation 
                de 14 jours <strong className="text-white/90">ne peut être exercé</strong> pour les contenus 
                numériques fournis sur un support immatériel dont l'exécution a commencé avec l'accord 
                préalable exprès du consommateur.
              </p>
              <p className="mt-3">
                En accédant à votre espace membre et en commençant à consommer le contenu du programme, 
                <strong className="text-white/90"> vous renoncez expressément à votre droit de rétractation</strong>.
              </p>
            </div>
          </section>

          {/* Avertissement Santé */}
          <section>
            <h2 className="font-sans text-xl md:text-2xl font-semibold mb-4 text-foreground">
              7. Avertissement santé
            </h2>
            <div className="bg-white/5 rounded-xl p-5 border border-white/10">
              <p className="font-medium text-white/90 mb-3">Clause de non-responsabilité médicale</p>
              <p>
                Les programmes NIVO sont conçus à des fins d'information et de bien-être général. 
                Ils ne constituent en aucun cas un avis médical, un diagnostic ou un traitement.
              </p>
              <ul className="list-disc list-inside mt-3 space-y-1 ml-2">
                <li>NIVO n'est pas un professionnel de santé</li>
                <li>Les conseils fournis ne remplacent pas une consultation médicale</li>
                <li>Consultez un médecin avant de commencer tout programme d'exercices</li>
                <li>En cas de douleur ou d'inconfort, cessez immédiatement l'exercice</li>
              </ul>
              <p className="mt-3">
                L'utilisateur reconnaît pratiquer les exercices sous sa propre responsabilité et 
                dégage NIVO de toute responsabilité en cas de blessure ou d'aggravation d'une condition préexistante.
              </p>
            </div>
          </section>

          {/* Responsabilité */}
          <section>
            <h2 className="font-sans text-xl md:text-2xl font-semibold mb-4 text-foreground">
              8. Limitation de responsabilité
            </h2>
            <p>
              NIVO s'engage à mettre en œuvre tous les moyens nécessaires pour assurer la qualité et la 
              disponibilité de ses services. Toutefois, NIVO ne saurait être tenue responsable :
            </p>
            <ul className="list-disc list-inside mt-3 space-y-1 ml-2">
              <li>Des interruptions temporaires du service pour maintenance</li>
              <li>De l'impossibilité d'accès due à des problèmes de connexion internet</li>
              <li>Des résultats individuels qui peuvent varier d'un utilisateur à l'autre</li>
            </ul>
          </section>

          {/* Propriété intellectuelle */}
          <section>
            <h2 className="font-sans text-xl md:text-2xl font-semibold mb-4 text-foreground">
              9. Propriété intellectuelle
            </h2>
            <p>
              L'ensemble du contenu des programmes (vidéos, audios, textes, méthodes) est protégé par le droit 
              d'auteur. L'achat d'un programme confère un droit d'utilisation personnel et non transférable. 
              Toute reproduction, partage ou revente est strictement interdit.
            </p>
          </section>

          {/* Droit applicable */}
          <section>
            <h2 className="font-sans text-xl md:text-2xl font-semibold mb-4 text-foreground">
              10. Droit applicable et litiges
            </h2>
            <p>
              Les présentes CGV sont soumises au droit français. En cas de litige, une solution amiable sera 
              recherchée en priorité. À défaut, les tribunaux français seront seuls compétents.
            </p>
            <p className="mt-3">
              Conformément à l'article L612-1 du Code de la consommation, vous pouvez recourir gratuitement 
              au service de médiation de la consommation.
            </p>
          </section>
        </div>

        {/* Footer Links */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-wrap gap-4 text-sm text-white/40">
          <Link to="/mentions-legales" className="hover:text-white/70 transition-colors">Mentions Légales</Link>
          <span>•</span>
          <Link to="/confidentialite" className="hover:text-white/70 transition-colors">Confidentialité</Link>
        </div>
      </main>
    </div>
  );
}
