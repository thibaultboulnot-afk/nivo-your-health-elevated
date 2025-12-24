import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function MentionsLegales() {
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
        <h1 className="font-sans text-3xl md:text-4xl font-bold mb-8 text-foreground">
          Mentions Légales
        </h1>

        <div className="space-y-10 text-white/70 leading-relaxed">
          {/* Identité */}
          <section>
            <h2 className="font-sans text-xl md:text-2xl font-semibold mb-4 text-foreground">
              1. Identité de l'éditeur
            </h2>
            <div className="space-y-2 bg-white/5 rounded-xl p-5 border border-white/10">
              <p><span className="text-white/90 font-medium">Raison sociale :</span> [Nom de la société]</p>
              <p><span className="text-white/90 font-medium">Forme juridique :</span> [SAS / SARL / Auto-entreprise]</p>
              <p><span className="text-white/90 font-medium">Capital social :</span> [Montant] €</p>
              <p><span className="text-white/90 font-medium">Adresse du siège :</span> [Adresse complète]</p>
            </div>
          </section>

          {/* Immatriculation */}
          <section>
            <h2 className="font-sans text-xl md:text-2xl font-semibold mb-4 text-foreground">
              2. Immatriculation
            </h2>
            <div className="space-y-2 bg-white/5 rounded-xl p-5 border border-white/10">
              <p><span className="text-white/90 font-medium">Numéro RCS :</span> [Numéro RCS]</p>
              <p><span className="text-white/90 font-medium">Numéro de TVA intracommunautaire :</span> [Numéro TVA]</p>
            </div>
          </section>

          {/* Contact */}
          <section>
            <h2 className="font-sans text-xl md:text-2xl font-semibold mb-4 text-foreground">
              3. Contact
            </h2>
            <div className="space-y-2 bg-white/5 rounded-xl p-5 border border-white/10">
              <p><span className="text-white/90 font-medium">Email :</span> contact@nivo-axis.com</p>
              <p><span className="text-white/90 font-medium">Téléphone :</span> [Numéro de téléphone]</p>
            </div>
          </section>

          {/* Hébergeur */}
          <section>
            <h2 className="font-sans text-xl md:text-2xl font-semibold mb-4 text-foreground">
              4. Hébergement
            </h2>
            <div className="space-y-2 bg-white/5 rounded-xl p-5 border border-white/10">
              <p><span className="text-white/90 font-medium">Hébergeur :</span> Vercel Inc.</p>
              <p><span className="text-white/90 font-medium">Adresse :</span> 340 S Lemon Ave #4133, Walnut, CA 91789, USA</p>
              <p className="mt-3 pt-3 border-t border-white/10">
                <span className="text-white/90 font-medium">Base de données :</span> Supabase Inc.
              </p>
              <p><span className="text-white/90 font-medium">Adresse :</span> 970 Toa Payoh North #07-04, Singapore 318992</p>
            </div>
          </section>

          {/* Directeur de publication */}
          <section>
            <h2 className="font-sans text-xl md:text-2xl font-semibold mb-4 text-foreground">
              5. Directeur de la publication
            </h2>
            <div className="space-y-2 bg-white/5 rounded-xl p-5 border border-white/10">
              <p><span className="text-white/90 font-medium">Nom :</span> [Prénom Nom du dirigeant]</p>
              <p><span className="text-white/90 font-medium">Qualité :</span> [Gérant / Président]</p>
            </div>
          </section>

          {/* Propriété intellectuelle */}
          <section>
            <h2 className="font-sans text-xl md:text-2xl font-semibold mb-4 text-foreground">
              6. Propriété intellectuelle
            </h2>
            <p>
              L'ensemble du contenu de ce site (textes, images, vidéos, logos, marques) est protégé par le droit d'auteur 
              et les lois relatives à la propriété intellectuelle. Toute reproduction, représentation, modification ou 
              exploitation non autorisée est strictement interdite.
            </p>
          </section>
        </div>

        {/* Footer Links */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-wrap gap-4 text-sm text-white/40">
          <Link to="/cgv" className="hover:text-white/70 transition-colors">CGV</Link>
          <span>•</span>
          <Link to="/confidentialite" className="hover:text-white/70 transition-colors">Confidentialité</Link>
        </div>
      </main>
    </div>
  );
}
