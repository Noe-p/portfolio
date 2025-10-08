'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, CheckCircle, Loader2, Send } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const createFormSchema = (t: (key: string) => string) =>
  z.object({
    name: z.string().min(1, t('contact.form.nameRequired')),
    email: z.string().min(1, t('contact.form.emailRequired')).email(t('contact.form.emailInvalid')),
    subject: z.string().min(1, t('contact.form.subjectRequired')),
    message: z.string().min(1, t('contact.form.messageRequired')),
    // Honeypot - doit rester vide
    website: z.string().max(0, 'Bot détecté'),
  });

type FormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
  website: string; // Honeypot field
};

interface ContactFormProps {
  onSubmit?: (data: FormData) => void;
  className?: string;
}

export function ContactForm({ onSubmit, className }: ContactFormProps) {
  const t = useTranslations('common');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const formSchema = createFormSchema(t);
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: 'onChange', // Validation en temps réel
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
      website: '', // Honeypot
    },
  });

  const handleSubmit = async (data: FormData) => {
    setStatus('loading');

    try {
      // Envoyer les données à l'API
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        // Récupérer le message d'erreur spécifique du serveur
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de l'envoi du message");
      }

      // Callback personnalisé si fourni
      if (onSubmit) {
        onSubmit(data);
      }

      setStatus('success');
      form.reset();

      // Réinitialiser le statut après 3 secondes
      setTimeout(() => {
        setStatus('idle');
        setErrorMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error sending message:', error);

      // Utiliser le message d'erreur du serveur
      let errorMessage = t('contact.form.error'); // Message par défaut

      if (error instanceof Error) {
        // Le message d'erreur contient déjà le message du serveur grâce au throw dans le !response.ok
        errorMessage = error.message;
      }

      setErrorMessage(errorMessage);
      setStatus('error');
      setTimeout(() => {
        setStatus('idle');
        setErrorMessage('');
      }, 3000);
    }
  };

  const getButtonContent = () => {
    switch (status) {
      case 'loading':
        return (
          <>
            <Loader2 className="mr-2 w-4 h-4 animate-spin" />
            {t('contact.form.sending')}
          </>
        );
      case 'success':
        return (
          <>
            <CheckCircle className="mr-2 w-4 h-4" />
            {t('contact.form.success')}
          </>
        );
      case 'error':
        return (
          <>
            <AlertCircle className="mr-2 w-4 h-4" />
            {errorMessage || t('contact.form.error')}
          </>
        );
      default:
        // Affichage dynamique selon l'état du formulaire
        if (hasEmptyRequiredFields()) {
          return (
            <>
              <Send className="mr-2 w-4 h-4 opacity-50" />
              {t('contact.form.fillAllFields')}
            </>
          );
        }
        if (hasErrors()) {
          return (
            <>
              <AlertCircle className="mr-2 w-4 h-4 opacity-50" />
              {t('contact.form.fixErrors')}
            </>
          );
        }
        return (
          <>
            <Send className="mr-2 w-4 h-4" />
            {t('contact.form.send')}
          </>
        );
    }
  };

  const getButtonVariant = () => {
    switch (status) {
      case 'success':
        return 'default';
      case 'error':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  // Vérifier si le formulaire a des erreurs ou des champs vides
  const hasErrors = () => {
    const errors = form.formState.errors;
    return Object.keys(errors).length > 0;
  };

  const hasEmptyRequiredFields = () => {
    const values = form.getValues();
    return !values.name || !values.email || !values.subject || !values.message;
  };

  const isSubmitDisabled = () => {
    return status === 'loading' || hasErrors() || hasEmptyRequiredFields();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className={`space-y-4 ${className || ''}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('contact.form.name')}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t('contact.form.namePlaceholder')}
                    {...field}
                    disabled={status === 'loading'}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('contact.form.email')}</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder={t('contact.form.emailPlaceholder')}
                    {...field}
                    disabled={status === 'loading'}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('contact.form.subject')}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t('contact.form.subjectPlaceholder')}
                  {...field}
                  disabled={status === 'loading'}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Honeypot - champ invisible pour piéger les bots */}
        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem style={{ position: 'absolute', left: '-9999px', opacity: 0 }}>
              <FormLabel>{'Website (ne pas remplir)'}</FormLabel>
              <FormControl>
                <Input {...field} tabIndex={-1} autoComplete="off" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('contact.form.message')}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t('contact.form.messagePlaceholder')}
                  className="min-h-[120px]"
                  {...field}
                  disabled={status === 'loading'}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          variant={getButtonVariant()}
          className={`w-full transition-all ${
            isSubmitDisabled() && status === 'idle'
              ? 'opacity-60 cursor-not-allowed'
              : 'opacity-100 '
          }`}
          disabled={isSubmitDisabled()}
        >
          {getButtonContent()}
        </Button>
      </form>
    </Form>
  );
}
