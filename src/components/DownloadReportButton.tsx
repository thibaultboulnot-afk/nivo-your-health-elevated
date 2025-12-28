// @ts-nocheck
import { useState } from 'react';
import type { RefObject } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface PostureHistoryItem {
  date: string;
  score: number;
  formattedDate: string;
}

interface DownloadReportButtonProps {
  nivoScore: number | null;
  postureHistory: PostureHistoryItem[];
  chartRef?: RefObject<HTMLDivElement>;
}

export function DownloadReportButton({ nivoScore, postureHistory, chartRef }: DownloadReportButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = async () => {
    setIsGenerating(true);
    
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      let yPosition = margin;

      // White background
      pdf.setFillColor(255, 255, 255);
      pdf.rect(0, 0, pageWidth, pageHeight, 'F');

      // Header with logo
      pdf.setFillColor(255, 107, 74);
      pdf.roundedRect(margin, yPosition, 12, 12, 2, 2, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text('N', margin + 4.5, yPosition + 8);

      pdf.setTextColor(50, 50, 50);
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text('NIVO', margin + 16, yPosition + 9);

      // Date
      const today = new Date().toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(120, 120, 120);
      pdf.text(today, pageWidth - margin, yPosition + 8, { align: 'right' });

      yPosition += 25;

      // Title
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(30, 30, 30);
      pdf.text('Rapport de Bilan', margin, yPosition);
      yPosition += 15;

      // Score section
      pdf.setFillColor(245, 245, 245);
      pdf.roundedRect(margin, yPosition, pageWidth - (margin * 2), 50, 4, 4, 'F');
      
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(100, 100, 100);
      pdf.text('NIVO SCORE ACTUEL', margin + 10, yPosition + 15);

      pdf.setFontSize(48);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(255, 107, 74);
      pdf.text(nivoScore !== null ? `${nivoScore}` : 'N/A', margin + 10, yPosition + 40);

      pdf.setFontSize(14);
      pdf.setTextColor(100, 100, 100);
      pdf.text('/ 100', margin + 55, yPosition + 40);

      yPosition += 60;

      // Capture chart if available
      if (chartRef?.current && postureHistory.length > 0) {
        try {
          const canvas = await html2canvas(chartRef.current, {
            backgroundColor: '#ffffff',
            scale: 2,
          });
          const chartImgData = canvas.toDataURL('image/png');
          
          pdf.setFontSize(14);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(30, 30, 30);
          pdf.text('Évolution de l\'Alignement', margin, yPosition);
          yPosition += 10;

          const chartWidth = pageWidth - (margin * 2);
          const chartHeight = (canvas.height / canvas.width) * chartWidth;
          pdf.addImage(chartImgData, 'PNG', margin, yPosition, chartWidth, Math.min(chartHeight, 60));
          yPosition += Math.min(chartHeight, 60) + 10;
        } catch (e) {
          console.error('Error capturing chart:', e);
        }
      }

      // Observations section
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(30, 30, 30);
      pdf.text('Observations', margin, yPosition);
      yPosition += 10;

      pdf.setFillColor(250, 250, 250);
      pdf.roundedRect(margin, yPosition, pageWidth - (margin * 2), 40, 4, 4, 'F');

      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(60, 60, 60);

      const observations: string[] = [];
      if (nivoScore !== null) {
        if (nivoScore < 40) {
          observations.push('• Système en tension : routine d\'optimisation recommandée');
        } else if (nivoScore < 60) {
          observations.push('• Tensions détectées : maintenir la routine quotidienne');
        } else if (nivoScore >= 80) {
          observations.push('• Système optimal : mode maintenance recommandé');
        } else {
          observations.push('• Système stable : continuer les exercices');
        }
      }

      if (postureHistory.length > 0) {
        const lastScore = postureHistory[postureHistory.length - 1]?.score;
        if (lastScore !== undefined && lastScore < 70) {
          observations.push('• Alignement à améliorer : attention à la posture');
        } else if (lastScore !== undefined) {
          observations.push('• Bon alignement général');
        }
      }

      observations.forEach((obs, index) => {
        pdf.text(obs, margin + 8, yPosition + 12 + (index * 8));
      });

      yPosition += 50;

      // Legal footer
      pdf.setFillColor(255, 247, 237);
      pdf.roundedRect(margin, pageHeight - 35, pageWidth - (margin * 2), 20, 2, 2, 'F');
      
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(180, 120, 80);
      const legalText = 'Ce document est généré par un algorithme à titre informatif et ne remplace pas un avis médical.';
      pdf.text(legalText, pageWidth / 2, pageHeight - 22, { align: 'center' });

      pdf.setFontSize(7);
      pdf.setTextColor(150, 150, 150);
      pdf.text('NIVO - Outil d\'hygiène de vie', pageWidth / 2, pageHeight - 15, { align: 'center' });

      // Download
      pdf.save(`NIVO_Rapport_${new Date().toISOString().split('T')[0]}.pdf`);
      toast.success('Rapport téléchargé avec succès');

    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Erreur lors de la génération du rapport');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      onClick={generatePDF}
      disabled={isGenerating}
      variant="outline"
      size="sm"
      className="border-primary/30 text-primary hover:bg-primary/10"
    >
      {isGenerating ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Génération...
        </>
      ) : (
        <>
          <Download className="h-4 w-4 mr-2" />
          Télécharger le Rapport
        </>
      )}
    </Button>
  );
}
