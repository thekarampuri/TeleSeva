export interface FormattedResponse {
  message: string;
  urgencyLevel: 'low' | 'medium' | 'high' | 'emergency';
  urgencyIcon: string;
  urgencyColor: string;
  sections: {
    acknowledgment?: string;
    analysis?: string;
    questions?: string[];
    possibleConditions?: string[];
    recommendations?: string[];
    medicines?: MedicineRecommendation[];
    nextSteps?: string;
    disclaimer?: string;
  };
}

export interface MedicineRecommendation {
  name: string;
  dosage?: string;
  frequency?: string;
  duration?: string;
  notes?: string;
  contraindications?: string[];
}

class ResponseFormatter {
  /**
   * Format AI response into structured, user-friendly format
   */
  formatResponse(rawResponse: string): FormattedResponse {
    const sections = this.parseResponseSections(rawResponse);
    const urgencyLevel = this.extractUrgencyLevel(rawResponse);
    
    return {
      message: rawResponse,
      urgencyLevel,
      urgencyIcon: this.getUrgencyIcon(urgencyLevel),
      urgencyColor: this.getUrgencyColor(urgencyLevel),
      sections
    };
  }

  /**
   * Parse response into structured sections
   */
  private parseResponseSections(response: string): FormattedResponse['sections'] {
    const sections: FormattedResponse['sections'] = {};

    // Extract acknowledgment (usually first paragraph)
    const acknowledgmentMatch = response.match(/^([^.!?]*[.!?])/);
    if (acknowledgmentMatch) {
      sections.acknowledgment = acknowledgmentMatch[1].trim();
    }

    // Extract questions
    const questionMatches = response.match(/\*\*Questions?\*\*:?\s*([^*]+)/i);
    if (questionMatches) {
      sections.questions = questionMatches[1]
        .split(/[?]\s*/)
        .filter(q => q.trim())
        .map(q => q.trim() + '?');
    }

    // Extract possible conditions
    const conditionsMatch = response.match(/\*\*(?:Possible Conditions?|Likely Condition)\*\*:?\s*([^*]+)/i);
    if (conditionsMatch) {
      sections.possibleConditions = conditionsMatch[1]
        .split(/[,\n]/)
        .map(c => c.trim())
        .filter(c => c);
    }

    // Extract recommendations
    const recommendationsMatch = response.match(/\*\*Recommendations?\*\*:?\s*([^*]+)/i);
    if (recommendationsMatch) {
      sections.recommendations = recommendationsMatch[1]
        .split(/[-•\n]/)
        .map(r => r.trim())
        .filter(r => r);
    }

    // Extract medicines
    const medicinesMatch = response.match(/\*\*(?:Medications?|Medicines?)\*\*:?\s*([^*]+)/i);
    if (medicinesMatch) {
      sections.medicines = this.parseMedicineRecommendations(medicinesMatch[1]);
    }

    // Extract next steps
    const nextStepsMatch = response.match(/\*\*(?:Next Steps?|Urgency)\*\*:?\s*([^*]+)/i);
    if (nextStepsMatch) {
      sections.nextSteps = nextStepsMatch[1].trim();
    }

    // Always include disclaimer
    sections.disclaimer = "⚠️ This AI assessment is for informational purposes only and does not replace professional medical advice, diagnosis, or treatment. Always consult with qualified healthcare providers for medical concerns.";

    return sections;
  }

  /**
   * Parse medicine recommendations from text
   */
  private parseMedicineRecommendations(medicineText: string): MedicineRecommendation[] {
    const medicines: MedicineRecommendation[] = [];
    
    // Common medicine patterns
    const medicinePatterns = [
      /acetaminophen|tylenol/i,
      /ibuprofen|advil|motrin/i,
      /aspirin/i,
      /antihistamine|benadryl|claritin|zyrtec/i,
      /antacid|tums|rolaids/i,
      /decongestant|sudafed/i,
      /cough syrup|dextromethorphan/i,
      /throat lozenge/i,
      /hydrocortisone/i,
      /calamine lotion/i
    ];

    const lines = medicineText.split(/[-•\n]/).map(line => line.trim()).filter(line => line);

    lines.forEach(line => {
      for (const pattern of medicinePatterns) {
        if (pattern.test(line)) {
          const medicine = this.extractMedicineDetails(line);
          if (medicine) {
            medicines.push(medicine);
            break;
          }
        }
      }
    });

    return medicines;
  }

  /**
   * Extract medicine details from a line of text
   */
  private extractMedicineDetails(line: string): MedicineRecommendation | null {
    // Basic medicine name extraction
    const medicineNames = {
      'acetaminophen': 'Acetaminophen (Tylenol)',
      'tylenol': 'Acetaminophen (Tylenol)',
      'ibuprofen': 'Ibuprofen (Advil, Motrin)',
      'advil': 'Ibuprofen (Advil, Motrin)',
      'motrin': 'Ibuprofen (Advil, Motrin)',
      'aspirin': 'Aspirin',
      'antihistamine': 'Antihistamine (Benadryl, Claritin)',
      'benadryl': 'Diphenhydramine (Benadryl)',
      'claritin': 'Loratadine (Claritin)',
      'zyrtec': 'Cetirizine (Zyrtec)',
      'antacid': 'Antacid (Tums, Rolaids)',
      'tums': 'Calcium Carbonate (Tums)',
      'rolaids': 'Calcium Carbonate (Rolaids)',
      'decongestant': 'Decongestant (Sudafed)',
      'sudafed': 'Pseudoephedrine (Sudafed)'
    };

    for (const [key, name] of Object.entries(medicineNames)) {
      if (line.toLowerCase().includes(key)) {
        return {
          name,
          dosage: this.extractDosage(line),
          frequency: this.extractFrequency(line),
          notes: "Follow package directions. Consult pharmacist if unsure."
        };
      }
    }

    return null;
  }

  /**
   * Extract dosage information from text
   */
  private extractDosage(text: string): string | undefined {
    const dosagePatterns = [
      /(\d+)\s*mg/i,
      /(\d+)\s*tablets?/i,
      /(\d+)\s*capsules?/i
    ];

    for (const pattern of dosagePatterns) {
      const match = text.match(pattern);
      if (match) {
        return match[0];
      }
    }

    return undefined;
  }

  /**
   * Extract frequency information from text
   */
  private extractFrequency(text: string): string | undefined {
    const frequencyPatterns = [
      /every\s+(\d+)\s+hours?/i,
      /(\d+)\s+times?\s+(?:a\s+)?day/i,
      /twice\s+(?:a\s+)?day/i,
      /once\s+(?:a\s+)?day/i,
      /as\s+needed/i
    ];

    for (const pattern of frequencyPatterns) {
      const match = text.match(pattern);
      if (match) {
        return match[0];
      }
    }

    return undefined;
  }

  /**
   * Extract urgency level from response
   */
  private extractUrgencyLevel(response: string): 'low' | 'medium' | 'high' | 'emergency' {
    const emergencyKeywords = ['emergency', 'immediate', '🚨', 'call 911', 'emergency room'];
    const highKeywords = ['urgent', 'serious', '🔴', 'within 24 hours', 'see doctor soon'];
    const mediumKeywords = ['monitor', 'schedule appointment', '🟡', 'few days', 'keep an eye'];
    
    const lowerResponse = response.toLowerCase();

    if (emergencyKeywords.some(keyword => lowerResponse.includes(keyword.toLowerCase()))) {
      return 'emergency';
    }
    
    if (highKeywords.some(keyword => lowerResponse.includes(keyword.toLowerCase()))) {
      return 'high';
    }
    
    if (mediumKeywords.some(keyword => lowerResponse.includes(keyword.toLowerCase()))) {
      return 'medium';
    }

    return 'low';
  }

  /**
   * Get urgency icon
   */
  private getUrgencyIcon(urgency: 'low' | 'medium' | 'high' | 'emergency'): string {
    const icons = {
      'low': '🟢',
      'medium': '🟡',
      'high': '🔴',
      'emergency': '🚨'
    };
    return icons[urgency];
  }

  /**
   * Get urgency color class
   */
  private getUrgencyColor(urgency: 'low' | 'medium' | 'high' | 'emergency'): string {
    const colors = {
      'low': 'text-green-600 bg-green-50 border-green-200',
      'medium': 'text-yellow-600 bg-yellow-50 border-yellow-200',
      'high': 'text-orange-600 bg-orange-50 border-orange-200',
      'emergency': 'text-red-600 bg-red-50 border-red-200'
    };
    return colors[urgency];
  }

  /**
   * Format message for display with proper styling
   */
  formatMessageForDisplay(formattedResponse: FormattedResponse): string {
    let displayMessage = '';

    // Add urgency indicator
    displayMessage += `${formattedResponse.urgencyIcon} **${formattedResponse.urgencyLevel.toUpperCase()} PRIORITY**\n\n`;

    // Add acknowledgment
    if (formattedResponse.sections.acknowledgment) {
      displayMessage += `${formattedResponse.sections.acknowledgment}\n\n`;
    }

    // Add questions
    if (formattedResponse.sections.questions?.length) {
      displayMessage += `**Questions for you:**\n`;
      formattedResponse.sections.questions.forEach(q => {
        displayMessage += `• ${q}\n`;
      });
      displayMessage += '\n';
    }

    // Add possible conditions
    if (formattedResponse.sections.possibleConditions?.length) {
      displayMessage += `**Possible explanations:**\n`;
      formattedResponse.sections.possibleConditions.forEach(condition => {
        displayMessage += `• ${condition}\n`;
      });
      displayMessage += '\n';
    }

    // Add recommendations
    if (formattedResponse.sections.recommendations?.length) {
      displayMessage += `**Recommendations:**\n`;
      formattedResponse.sections.recommendations.forEach(rec => {
        displayMessage += `• ${rec}\n`;
      });
      displayMessage += '\n';
    }

    // Add medicines
    if (formattedResponse.sections.medicines?.length) {
      displayMessage += `**Suggested medications:**\n`;
      formattedResponse.sections.medicines.forEach(med => {
        displayMessage += `• **${med.name}**`;
        if (med.dosage) displayMessage += ` - ${med.dosage}`;
        if (med.frequency) displayMessage += ` ${med.frequency}`;
        displayMessage += '\n';
        if (med.notes) displayMessage += `  ${med.notes}\n`;
      });
      displayMessage += '\n';
    }

    // Add next steps
    if (formattedResponse.sections.nextSteps) {
      displayMessage += `**Next steps:**\n${formattedResponse.sections.nextSteps}\n\n`;
    }

    // Add disclaimer
    displayMessage += `---\n${formattedResponse.sections.disclaimer}`;

    return displayMessage;
  }
}

// Export singleton instance
export const responseFormatter = new ResponseFormatter();

// Export class for testing
export { ResponseFormatter };
