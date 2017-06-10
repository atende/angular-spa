import { Directive, Input, TemplateRef, ViewContainerRef, ElementRef } from '@angular/core'
import { AuthService } from '../auth.service'
import { RoleDirective, RoleContext } from './interfaces'
import { DomService } from '../dom/dom.service'

@Directive({ selector: '[secHasNotRoles]' })
export class HasNotRoles extends RoleDirective {
    @Input('secHasNotRoles') _roles: string
    @Input('resource') _resource: string

    constructor(
        protected element: ViewContainerRef,
        protected domService: DomService,
        protected auth: AuthService,
        templateRef: TemplateRef<RoleContext>
    ) {
        super(element, domService, templateRef)
    }

    ngOnInit() {
        this.applyDirective()
    }

    roleFunction = (roles: string[], resource?: string): boolean => {
        for (let role of roles) {
            if (this.auth.hasRole(role, resource)) {
                return false
            }
        }
        return true
    }
}
