import React, { useState } from 'react';
import { Home, Copy, Download, Sparkles, FileText, Database, ArrowLeft, CheckCircle, Zap } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';
import Modal from './Modal';

interface PropertyFormatterProps {
  initialText?: string;
  onBackToTimestamp?: () => void;
}

interface FormattedOutput {
  text: string;
  data: {
    property_type: string;
    owner_name: string;
    owner_contact: string;
    area: string;
    address: string;
    sub_property_type: string;
    size: string;
    furnishing_status: string;
    availability: string;
    floor: string;
    tenant_preference: string;
    additional_details: string;
    age: string;
    rent_or_sell_price: string;
    deposit: string;
  };
}

const PropertyFormatter: React.FC<PropertyFormatterProps> = ({ initialText = '', onBackToTimestamp }) => {
  const [inputText, setInputText] = useState(initialText);
  const [outputText, setOutputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [formattedOutputs, setFormattedOutputs] = useState<FormattedOutput[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [modal, setModal] = useState<{
    isOpen: boolean;
    type: 'success' | 'error' | 'info' | 'confirm';
    title: string;
    message: string;
    onConfirm?: () => void;
  }>({
    isOpen: false,
    type: 'info',
    title: '',
    message: ''
  });

  const showModal = (
    type: 'success' | 'error' | 'info' | 'confirm', 
    title: string, 
    message: string, 
    onConfirm?: () => void
  ) => {
    setModal({ isOpen: true, type, title, message, onConfirm });
  };

  const formatMessages = async () => {
    if (!inputText.trim()) {
      showModal('error', 'Input Required', 'Please enter your property message before formatting.');
      return;
    }

    setIsProcessing(true);

    // Simulate processing delay for better UX
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      // All the complex property formatting logic from the original code
      let processedInputText = inputText;
      
      const validareas = [
        "Aundh","Balewadi","Baner","Bavdhan","Bhosari","Bibwewadi","Budhwar Peth","Chakan",
        "Dhanori","Dhanraj Road","Deccan Gymkhana","Dhayari","Hadapsar","Hinjewadi","Kalyani Nagar",
        "Karve Nagar","Katraj","Kharadi","Kondhwa","Koregaon Park","Kothrud","Lohegaon","Lullanagar",
        "Magarpatta","Marunji","Model Colony","Mohammedwadi","Moshi","Mundhwa","NIBM Road","Narayan Peth",
        "Pashan","Pimple Saudagar","Pimple Gurav","Pimple Nilakh","Pimpri Chinchwad","Ravet","Sadashiv Peth",
        "Sahakar Nagar","Shaniwar Peth","Shivajinagar","Sinhagad Road","Swargate","Talegaon","Tathawade",
        "Undri","Uruli Kanchan","Viman Nagar","Vishrantwadi","Wagholi","Wakad","Wanwadi","Warje",
        "Wadgaon Sheri","Yerawada","Chinchwad","Sus","Kate Wasti","Nigdi","Susgav","Suisgaon","Rahatani","Akurdi",
        "Punawale","Baner Mahalunge Rd","Pimpri","Chinchwad","Ghorpadi","Bund Garden"
      ];

      const escapedAreas = validareas.map(area => area.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'));
      const areaSplitPattern = new RegExp(`^(${escapedAreas.join('|')})(?:\\s+|\t+)(.*)$`, 'gmi');
      processedInputText = processedInputText.replace(areaSplitPattern, (match, area, residual) => {
        return `${area}\n${residual}`;
      });

      const messagePattern = /\[\s*\d{1,2}\/\d{1,2}\s*,\s*?\d{1,2}:\d{2}\s*(?:AM|PM|am|pm)\s*\]/gi;
      let messages = [];
      let timestamps = [...processedInputText.matchAll(messagePattern)].map(match => match[0]);
      let contents = processedInputText.split(messagePattern).map(content => content.trim()).filter(content => content.length > 0);

      for (let i = 0; i < contents.length; i++) {
        let timestamp = timestamps[i] || '';
        let content = contents[i];
        if (content) {
          messages.push(`${timestamp}\n${content}`.trim());
        }
      }

      let formattedOutputs: FormattedOutput[] = [];
      const timestampPattern = /\[\s*(\d{1,2}:\d{2}\s*(?:AM|PM|am|pm))\s*,\s*(\d{1,2}\/\d{1,2}\/\d{2,4})\s*\]/gi;
      const validSubPropertyTypes = [
        "1 BHK", "2 BHK", "3 BHK", "4 BHK", "1 Rk", "3.5 BHK", "1RK", "4.5 BHK", "5 BHK",
        "6 BHK", "8 BHK", "N/A", "10 BHK", "2.5 BHK", "1.5 BHK"
      ];
      const validFurnishingStatuses = [
        "Furnished", "Unfurnished", "Semi-Furnished"
      ];
      const validTenantPreferences = [
        "All", "Bachelors (Men Only)", "Bachelors (Men/Women)", "Bachelors (Women Only)",
        "Both", "Family Only", "N/A"
      ];
      const validAvailabilityOptions = [
        "Ready to move", "Immediate", "Immediately", "Available now", "Available"
      ];
      
      const areaPattern = new RegExp(`^(${escapedAreas.join('|')})$`, 'i');
      const subPropertyPattern = /(\d+(?:\.\d+)?)\s*(?:[-_\s]+)?\s*(BHK|RK)/i;
      const furnishingPattern = /(Furnished|Unfurnished|Semi-?Furnished|Semi\s+Furnished)/i;
      const availabilityPattern = /(Ready to move|Immediate|Immediately|Available now|Available)/i;
      const tenantPattern = /(Bachelors\s*\(Women Only\)|Bachelors\s*\(Men Only\)|Bachelors\s*\(Men\/Women\)|All|Both|Family(?:\s*Only)?)/i;
      const agePattern = /(\d+\s*(?:to\s*\d+\s*)?year[s]?\s*(?:old|\+)?)/i;
      const pricePattern = /(\d+(?:\.\d+)?)\s*(K|Lac|Lacs|L|Cr|C\s*r|Rs)/i;
      const depositMonthPattern = /(\d+\s*Month)/i;
      const invalidContactPattern = /\d+\*+/;
      const priceNotListedPattern = /(Price on call|Price on request|Call for price|Call for rent|Call for sale|Rent on call|Rent on request|Sale on call|Sale on request|Price upon request|Rent upon request|Sale upon request|Contact for price|Contact for rent|Contact for sale|Inquire for price|Inquire for rent|Inquire for sale|Price available on request|Rent available on request|Sale available on request)/i;

      function jaccardSimilarity(a: string, b: string): number {
        const setA = new Set(a.toLowerCase().split(''));
        const setB = new Set(b.toLowerCase().split(''));
        const intersection = new Set([...setA].filter(x => setB.has(x)));
        const union = new Set([...setA, ...setB]);
        return intersection.size / union.size;
      }

      for (let message of messages) {
        if (message.match(invalidContactPattern)) {
          continue;
        }

        let formattedTimestamp = 'N/A';
        message = message.replace(timestampPattern, (match, timePart, datePart) => {
          const amPmMatch = timePart.match(/(AM|PM|am|pm)/i);
          const amPm = amPmMatch ? amPmMatch[0].toLowerCase() : '';
          let timeClean = timePart.replace(/\s*(AM|PM|am|pm)/i, '').trim();
          let [hours, minutes] = timeClean.split(':').map(Number);
          if (hours === 0) hours = 12;
          else if (hours > 12) hours -= 12;
          timeClean = `${hours}:${minutes.toString().padStart(2, '0')} ${amPm}`;
          const [day, month] = datePart.trim().split('/').slice(0, 2);
          formattedTimestamp = `[${parseInt(day)}/${parseInt(month)}, ${timeClean}]`;
          return formattedTimestamp;
        });

        const lines = message.split('\n').map(line => line.trim());
        const output = {
          property_type: 'N/A',
          owner_name: 'N/A',
          owner_contact: 'N/A',
          area: 'Other',
          address: 'N/A',
          sub_property_type: 'N/A',
          size: 'N/A',
          furnishing_status: 'N/A',
          availability: 'N/A',
          floor: 'N/A',
          tenant_preference: 'N/A',
          additional_details: 'N/A',
          age: 'N/A',
          rent_or_sell_price: 'N/A',
          deposit: 'N/A'
        };

        const propertyTypePattern = /(Resale|Rental)/i;
        const ownerPattern = /Owner\s*([\s\S]*?)(?=\s*\d{10})/i;
        const contactPattern = /\d{10}/;
        const sizePattern = /(?:Carpet area|Built up area|Super Built-up area|\d+\s*(?:sq\.ft|sqft)\s*Built Up area)\s*:?\s*(\d+(?:\.\d+)?)\s*(?:sqft\.?|sq\.ft)?/i;
        const floorPattern = /\(?\s*(\d+(?:st|nd|rd|th)?)\s*(?:of|out\s+of)\s*(\d+(?:st|nd|rd|th)?)\s*(?:floor|floors)?\s*\)?/i;
        const additionalDetailsPattern = /(East|West|North|South)\s*facing|(\d+\s*(?:Covered|Open)?\s*Parking|No\s*Parking)/i;

        let prices: number[] = [];
        let depositFound = false;
        let areaFound = false;
        let addressLines: string[] = [];
        let priceNotListedFound = false;

        const propertyCodePattern = /Property Code/i;
        const messageParts = message.split(propertyCodePattern);
        const beforePropertyCode = messageParts[0] || message;
        let availabilityMatch = beforePropertyCode.match(availabilityPattern);
        if (availabilityMatch) {
          const matchedAvailability = validAvailabilityOptions.find(option => option.toLowerCase() === availabilityMatch![1].trim().toLowerCase());
          output.availability = matchedAvailability || 'N/A';
        }

        let propertyMatch = message.match(propertyTypePattern);
        if (propertyMatch) {
          output.property_type = propertyMatch[1].toLowerCase() === 'resale' ? 'Res_resale' : 'Res_rental';
        }

        for (let i = 0; i < lines.length; i++) {
          let line = lines[i];

          let ownerMatch = message.match(ownerPattern);
          if (ownerMatch && ownerMatch[1]) {
            output.owner_name = ownerMatch[1].trim();
          }

          let contactMatch = line.match(contactPattern);
          if (contactMatch) {
            output.owner_contact = contactMatch[0];
          }

          if (!areaFound) {
            let potentialArea = line.trim();
            let areaMatch = potentialArea.match(areaPattern);

            if (areaMatch) {
              const matchedArea = validareas.find(area => area.toLowerCase() === areaMatch![0].toLowerCase());
              output.area = matchedArea || 'Other';
              areaFound = true;
            } else {
              let bestMatch = null;
              let highestSimilarity = 0;
              for (let validArea of validareas) {
                const similarity = jaccardSimilarity(potentialArea, validArea);
                if (similarity > 0.8 && similarity > highestSimilarity) {
                  highestSimilarity = similarity;
                  bestMatch = validArea;
                }
              }
              if (bestMatch) {
                output.area = bestMatch;
                areaFound = true;
              }
            }

            if (areaFound) {
              for (let j = i + 1; j < lines.length; j++) {
                let nextLine = lines[j].trim();
                if (nextLine.match(subPropertyPattern)) {
                  break;
                }
                if (nextLine) {
                  addressLines.push(nextLine);
                }
              }
              if (addressLines.length > 0) {
                output.address = addressLines.join(', ').trim();
              }
              continue;
            }
          }

          let subPropertyMatch = line.match(subPropertyPattern);
          if (subPropertyMatch) {
            const numberPart = subPropertyMatch[1].trim();
            const typePart = subPropertyMatch[2].toUpperCase();
            const normalizedMatch = `${numberPart} ${typePart}`.replace(/\s+/g, ' ').trim();
            const matchedSubProperty = validSubPropertyTypes.find(type => type.toLowerCase() === normalizedMatch.toLowerCase());
            output.sub_property_type = matchedSubProperty || normalizedMatch;
          }

          let sizeMatch = line.match(sizePattern);
          if (sizeMatch) {
            output.size = `${sizeMatch[1]} sq.ft`;
          }

          let furnishingMatch = line.match(furnishingPattern);
          if (furnishingMatch) {
            const normalizedMatch = furnishingMatch[1].trim().toLowerCase().replace(/[-|\s+]/g, '');
            const matchedFurnishing = validFurnishingStatuses.find(status => status.toLowerCase().replace(/[-|\s+]/g, '') === normalizedMatch);
            output.furnishing_status = matchedFurnishing || furnishingMatch[1].trim();
          }

          let floorMatch = line.match(floorPattern);
          if (floorMatch) {
            output.floor = `${floorMatch[1]} of ${floorMatch[2]} floors`;
          }

          let tenantMatch = beforePropertyCode.match(tenantPattern);
          if (tenantMatch) {
            let matchedValue = tenantMatch[1].trim();
            if (matchedValue.toLowerCase() === 'family') {
              matchedValue = 'Family Only';
            }
            const matchedTenant = validTenantPreferences.find(pref => pref.toLowerCase() === matchedValue.toLowerCase());
            output.tenant_preference = matchedTenant || 'N/A';
          } else {
            output.tenant_preference = 'N/A';
          }

          let additionalMatch = line.match(additionalDetailsPattern);
          if (additionalMatch) {
            output.additional_details = additionalMatch[0].trim();
          }

          let ageMatch = line.match(agePattern);
          if (ageMatch) {
            output.age = ageMatch[1].trim();
          }

          let priceMatch = line.match(pricePattern);
          if (priceMatch && !depositFound) {
            let value = parseFloat(priceMatch[1]);
            let unit = priceMatch[2].toLowerCase();
            let converted = 0;
            if (unit === 'k') converted = value * 1000;
            else if (unit === 'lac' || unit === 'lacs' || unit === 'l') converted = value * 100000;
            else if (unit === 'cr' || unit === 'c r') converted = value * 10000000;
            else if (unit === 'rs') converted = value;
            prices.push(converted);
            if (prices.length === 1) {
              output.rent_or_sell_price = converted.toString();
            } else if (prices.length === 2 && output.property_type === 'Res_rental') {
              output.deposit = converted.toString();
              depositFound = true;
            }
          }

          let priceNotListedMatch = line.match(priceNotListedPattern);
          if (priceNotListedMatch && prices.length === 0 && !priceNotListedFound) {
            output.rent_or_sell_price = priceNotListedMatch[1].trim();
            priceNotListedFound = true;
            if (output.property_type === 'Res_rental' && i + 1 < lines.length) {
              let nextLine = lines[i + 1].trim();
              let nextDepositMatch = nextLine.match(depositMonthPattern);
              if (nextDepositMatch && !depositFound) {
                output.deposit = nextDepositMatch[1].trim();
                depositFound = true;
                i++;
              }
            }
          }

          let depositMonthMatch = line.match(depositMonthPattern);
          if (depositMonthMatch && prices.length === 1 && !depositFound && output.property_type === 'Res_rental') {
            output.deposit = depositMonthMatch[1].trim();
            depositFound = true;
          }
        }

        if (output.furnishing_status === 'N/A') {
          let furnishingMatch = message.match(furnishingPattern);
          if (furnishingMatch) {
            const normalizedMatch = furnishingMatch[1].trim().toLowerCase().replace(/[-|\s+]/g, '');
            const matchedFurnishing = validFurnishingStatuses.find(status => status.toLowerCase().replace(/[-|\s+]/g, '') === normalizedMatch);
            output.furnishing_status = matchedFurnishing || furnishingMatch[1].trim();
          }
        }

        formattedOutputs.push({
          text: `${formattedTimestamp}\n\n` +
            `1) property_type - ${output.property_type}\n` +
            `2) owner_name - ${output.owner_name}\n` +
            `3) owner_contact - ${output.owner_contact}\n` +
            `4) area - ${output.area}\n` +
            `5) address - ${output.address}\n` +
            `6) sub_property_type - ${output.sub_property_type}\n` +
            `7) size - ${output.size}\n` +
            `8) furnishing_status - ${output.furnishing_status}\n` +
            `9) availability - ${output.availability}\n` +
            `10) floor - ${output.floor}\n` +
            `11) tenant_preference - ${output.tenant_preference}\n` +
            `12) additional_details - ${output.additional_details}\n` +
            `13) age - ${output.age}\n` +
            `14) rent_or_sell_price - ${output.rent_or_sell_price}\n` +
            `15) deposit - ${output.deposit}`,
          data: output
        });
      }

      setFormattedOutputs(formattedOutputs);
      setOutputText(formattedOutputs.map(output => output.text).join('\n\n---\n\n'));
      setIsProcessing(false);
      setShowSuccess(true);
      
      setTimeout(() => setShowSuccess(false), 3000);
      
      showModal('success', 'Processing Complete!', `Successfully processed ${formattedOutputs.length} property entries with advanced AI formatting.`);
    } catch (error) {
      setIsProcessing(false);
      showModal('error', 'Processing Failed', 'An error occurred while processing your message. Please try again.');
    }
  };

  const copyToClipboard = async () => {
    if (!outputText.trim()) {
      showModal('error', 'No Output to Copy', 'Please format your messages first before copying.');
      return;
    }

    try {
      await navigator.clipboard.writeText(outputText);
      showModal('success', 'Copied Successfully!', 'Formatted property data has been copied to your clipboard.');
    } catch (err) {
      showModal('error', 'Copy Failed', 'Failed to copy to clipboard. Please try again or copy manually.');
    }
  };

  const downloadAsCSV = () => {
    if (!formattedOutputs || formattedOutputs.length === 0) {
      showModal('error', 'No Data to Export', 'Please format messages first before downloading CSV.');
      return;
    }

    const confirmDownload = () => {
      const headers = [
        'property_id', 'property_type', 'special_note', 'owner_name',
        'owner_contact', 'area', 'address', 'sub_property_type', 'size',
        'furnishing_status', 'availability', 'floor', 'tenant_preference',
        'additional_details', 'age', 'rent_or_sell_price', 'deposit', 'date_stamp', 'rent_sold_out'
      ];

      const escapeCsv = (value: any) => {
        if (value == null) return '';
        const str = value.toString();
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
          return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
      };

      let csvRows = [headers.join(',')];
      for (let output of formattedOutputs) {
        const row = headers.map(header => {
          if (['property_id', 'special_note', 'date_stamp', 'rent_sold_out'].includes(header)) {
            return '';
          }
          return escapeCsv(output.data[header as keyof typeof output.data]);
        }).join(',');
        csvRows.push(row);
      }

      const csvContent = csvRows.join('\n');

      const now = new Date();
      const day = String(now.getDate()).padStart(2, '0');
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const year = String(now.getFullYear()).slice(2);
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const timestamp = `${day}/${month}/${year},${hours}:${minutes}`;
      const filename = `Property_Details_${timestamp}.csv`;

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showModal('success', 'Download Complete!', `Your CSV file "${filename}" has been downloaded successfully.`);
    };

    showModal(
      'confirm', 
      'Download CSV File', 
      `Ready to export ${formattedOutputs.length} property entries as CSV. Continue with download?`,
      confirmDownload
    );
  };

  return (
    <div className="animate-slideInUp">
      <div className="bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 p-8 border-b border-white/10">
          {onBackToTimestamp && (
            <button
              onClick={onBackToTimestamp}
              className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200 group mb-6"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
              <span>Back to Timestamp Formatter</span>
            </button>
          )}
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl mb-4 shadow-lg animate-pulse-gentle">
              <Home className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2 flex items-center justify-center space-x-2">
              <Zap className="w-6 h-6 text-emerald-400" />
              <span>Property Formatter</span>
            </h2>
            <p className="text-gray-300 text-lg">Transform raw property messages into structured, professional formats</p>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {/* Input Section */}
          <div className="space-y-4">
            <label className="flex items-center text-lg font-semibold text-white">
              <FileText className="w-5 h-5 mr-3 text-emerald-400" />
              Input Property Messages
            </label>
            <div className="relative">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                rows={12}
                maxLength={10000000}
                className="w-full bg-white/5 backdrop-blur-sm border-2 border-white/20 rounded-2xl p-6 text-white placeholder-gray-400 focus:border-emerald-400 focus:outline-none transition-all duration-300 resize-none text-base leading-relaxed hover:bg-white/10"
                placeholder="Paste your property messages here..."
              />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          </div>

          {/* Format Button */}
          <div className="flex justify-center">
            <button
              onClick={formatMessages}
              disabled={isProcessing}
              className="group relative px-12 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl font-bold text-lg shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center space-x-3">
                {isProcessing ? (
                  <>
                    <LoadingSpinner size="sm" color="text-white" />
                    <span>Processing Properties...</span>
                  </>
                ) : showSuccess ? (
                  <>
                    <CheckCircle className="w-6 h-6" />
                    <span>Processed!</span>
                  </>
                ) : (
                  <>
                    <Database className="w-6 h-6" />
                    <span>Format Properties</span>
                  </>
                )}
              </div>
            </button>
          </div>

          {/* Output Section */}
          <div className="space-y-4">
            <label className="flex items-center text-lg font-semibold text-white">
              <Sparkles className="w-5 h-5 mr-3 text-blue-400" />
              Formatted Output
            </label>
            <div className="relative">
              <textarea
                value={outputText}
                readOnly
                rows={12}
                maxLength={10000000}
                className="w-full bg-white/5 backdrop-blur-sm border-2 border-white/20 rounded-2xl p-6 text-white resize-none text-base leading-relaxed font-mono"
                placeholder="Your formatted property data will appear here..."
              />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={copyToClipboard}
              disabled={!outputText.trim()}
              className="group relative px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center justify-center space-x-2">
                <Copy className="w-5 h-5" />
                <span>Copy to Clipboard</span>
              </div>
            </button>
            
            <button
              onClick={downloadAsCSV}
              disabled={!formattedOutputs.length}
              className="group relative px-8 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-semibold shadow-2xl hover:shadow-pink-500/25 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-rose-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center justify-center space-x-2">
                <Download className="w-5 h-5" />
                <span>Download CSV</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={modal.isOpen}
        onClose={() => setModal(prev => ({ ...prev, isOpen: false }))}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        onConfirm={modal.onConfirm}
        confirmText="Download"
        cancelText="Cancel"
      />
    </div>
  );
};

export default PropertyFormatter;